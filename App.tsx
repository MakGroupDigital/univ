import React, { useState, useEffect } from 'react';
import { 
  Plus, Cloud, Settings, RefreshCw, X, CloudDownload, Menu, BookOpen, GraduationCap
} from 'lucide-react';
import { Universite, Ecole, Stats } from './types';
import { COLORS, STORAGE_KEY, STORAGE_KEY_ECOLES } from './constants';
import { db } from './firebase.config';
import { collection, addDoc, getDocs, deleteDoc, writeBatch, onSnapshot } from 'firebase/firestore';
import { InstallPrompt } from './InstallPrompt';
import { UniversitesSection } from './UniversitesSection';
import { EcolesSection } from './EcolesSection';

const initialUniversites: Universite[] = [
  { id: 1, nom: "Université de Kinshasa", ville: "Kinshasa", statut: "Envoyé", reponse: "En attente", observation: "Dossier déposé au rectorat" },
  { id: 2, nom: "UNILU", ville: "Lubumbashi", statut: "En préparation", reponse: "-", observation: "Attente relevés de notes" },
  { id: 3, nom: "Université de Liège", ville: "Liège", statut: "Envoyé", reponse: "Positive", observation: "Bourse d'étude confirmée" }
];

const initialEcoles: Ecole[] = [
  { id: 1, nom: "Lycée Kasavubu", niveau: "Terminale", statut: "Envoyé", reponse: "Positive", observation: "Admission confirmée" },
  { id: 2, nom: "Collège Saint-Joseph", niveau: "3ème", statut: "En préparation", reponse: "-", observation: "Dossier en cours" }
];

type Section = 'universites' | 'ecoles';

const App: React.FC = () => {
  const [section, setSection] = useState<Section>('universites');
  
  const [universites, setUniversites] = useState<Universite[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialUniversites;
  });

  const [ecoles, setEcoles] = useState<Ecole[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ECOLES);
    return saved ? JSON.parse(saved) : initialEcoles;
  });

  const [statsUniv, setStatsUniv] = useState<Stats>({ total: 0, envoyes: 0, reponses: 0 });
  const [statsEcoles, setStatsEcoles] = useState<Stats>({ total: 0, envoyes: 0, reponses: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastSync, setLastSync] = useState(() => localStorage.getItem('last_sync_date') || 'Jamais');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculer les stats
  useEffect(() => {
    const validUniv = universites.filter(item => item.nom.trim() !== "");
    setStatsUniv({
      total: validUniv.length,
      envoyes: universites.filter(item => item.statut === "Envoyé").length,
      reponses: universites.filter(item => ["Positive", "Négative"].includes(item.reponse)).length
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(universites));
  }, [universites]);

  useEffect(() => {
    const validEcoles = ecoles.filter(item => item.nom.trim() !== "");
    setStatsEcoles({
      total: validEcoles.length,
      envoyes: ecoles.filter(item => item.statut === "Envoyé").length,
      reponses: ecoles.filter(item => ["Positive", "Négative"].includes(item.reponse)).length
    });
    localStorage.setItem(STORAGE_KEY_ECOLES, JSON.stringify(ecoles));
  }, [ecoles]);

  // Écouter Firebase pour universités
  useEffect(() => {
    const univRef = collection(db, 'universites');
    const unsubscribe = onSnapshot(univRef, (snapshot) => {
      if (!snapshot.empty) {
        const cloudData: Universite[] = snapshot.docs.map(doc => ({
          id: doc.data().id,
          nom: doc.data().nom,
          ville: doc.data().ville,
          statut: doc.data().statut,
          reponse: doc.data().reponse,
          observation: doc.data().observation
        }));
        
        if (JSON.stringify(cloudData) !== JSON.stringify(universites)) {
          setUniversites(cloudData);
        }
      }
    }, (error) => console.log('Firebase listener:', error.message));

    return () => unsubscribe();
  }, [universites]);

  // Écouter Firebase pour écoles
  useEffect(() => {
    const ecolesRef = collection(db, 'ecoles');
    const unsubscribe = onSnapshot(ecolesRef, (snapshot) => {
      if (!snapshot.empty) {
        const cloudData: Ecole[] = snapshot.docs.map(doc => ({
          id: doc.data().id,
          nom: doc.data().nom,
          niveau: doc.data().niveau,
          statut: doc.data().statut,
          reponse: doc.data().reponse,
          observation: doc.data().observation
        }));
        
        if (JSON.stringify(cloudData) !== JSON.stringify(ecoles)) {
          setEcoles(cloudData);
        }
      }
    }, (error) => console.log('Firebase listener:', error.message));

    return () => unsubscribe();
  }, [ecoles]);

  // Universités
  const modifierUniversite = (id: number, champ: keyof Universite, valeur: string) => {
    setUniversites(prev => prev.map(item => item.id === id ? { ...item, [champ]: valeur } : item));
  };

  const ajouterUniversite = () => {
    const nouvelId = universites.length > 0 ? Math.max(...universites.map(i => i.id)) + 1 : 1;
    setUniversites(prev => [...prev, { id: nouvelId, nom: "", ville: "", statut: "Non envoyé", reponse: "-", observation: "" }]);
    setMobileMenuOpen(false);
  };

  const supprimerUniversite = (id: number) => {
    if (window.confirm("Supprimer cette ligne ?")) {
      setUniversites(prev => prev.filter(item => item.id !== id));
    }
  };

  // Écoles
  const modifierEcole = (id: number, champ: keyof Ecole, valeur: string) => {
    setEcoles(prev => prev.map(item => item.id === id ? { ...item, [champ]: valeur } : item));
  };

  const ajouterEcole = () => {
    const nouvelId = ecoles.length > 0 ? Math.max(...ecoles.map(i => i.id)) + 1 : 1;
    setEcoles(prev => [...prev, { id: nouvelId, nom: "", niveau: "", statut: "Non envoyé", reponse: "-", observation: "" }]);
    setMobileMenuOpen(false);
  };

  const supprimerEcole = (id: number) => {
    if (window.confirm("Supprimer cette ligne ?")) {
      setEcoles(prev => prev.filter(item => item.id !== id));
    }
  };

  // Synchronisation
  const saveToCloud = async () => {
    setIsSyncing(true);
    try {
      // Sauvegarder universités
      const univRef = collection(db, 'universites');
      const existingUniv = await getDocs(univRef);
      const batchUniv = writeBatch(db);
      existingUniv.forEach(doc => batchUniv.delete(doc.ref));
      await batchUniv.commit();

      for (const row of universites) {
        await addDoc(univRef, { ...row, createdAt: new Date() });
      }

      // Sauvegarder écoles
      const ecolesRef = collection(db, 'ecoles');
      const existingEcoles = await getDocs(ecolesRef);
      const batchEcoles = writeBatch(db);
      existingEcoles.forEach(doc => batchEcoles.delete(doc.ref));
      await batchEcoles.commit();

      for (const row of ecoles) {
        await addDoc(ecolesRef, { ...row, createdAt: new Date() });
      }

      const now = new Date().toLocaleString('fr-FR');
      setLastSync(now);
      localStorage.setItem('last_sync_date', now);
      alert("✓ Données sauvegardées !");
    } catch (error) {
      alert("Erreur : " + (error instanceof Error ? error.message : "Erreur lors de la sauvegarde"));
    } finally {
      setIsSyncing(false);
    }
  };

  const loadFromCloud = async () => {
    setIsSyncing(true);
    try {
      const univRef = collection(db, 'universites');
      const univSnapshot = await getDocs(univRef);
      if (!univSnapshot.empty) {
        const cloudUniv: Universite[] = univSnapshot.docs.map(doc => ({
          id: doc.data().id,
          nom: doc.data().nom,
          ville: doc.data().ville,
          statut: doc.data().statut,
          reponse: doc.data().reponse,
          observation: doc.data().observation
        }));
        setUniversites(cloudUniv);
      }

      const ecolesRef = collection(db, 'ecoles');
      const ecolesSnapshot = await getDocs(ecolesRef);
      if (!ecolesSnapshot.empty) {
        const cloudEcoles: Ecole[] = ecolesSnapshot.docs.map(doc => ({
          id: doc.data().id,
          nom: doc.data().nom,
          niveau: doc.data().niveau,
          statut: doc.data().statut,
          reponse: doc.data().reponse,
          observation: doc.data().observation
        }));
        setEcoles(cloudEcoles);
      }

      const now = new Date().toLocaleString('fr-FR');
      setLastSync(now);
      localStorage.setItem('last_sync_date', now);
      alert("✓ Données importées !");
    } catch (error) {
      alert("Erreur : " + (error instanceof Error ? error.message : "Erreur lors du chargement"));
    } finally {
      setIsSyncing(false);
    }
  };

  const currentStats = section === 'universites' ? statsUniv : statsEcoles;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20 md:pb-0">
      <InstallPrompt />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-2 h-10 bg-[${COLORS.RDC_RED}] rounded-full`}></div>
              <div className="min-w-0">
                <h1 className={`text-lg md:text-2xl font-black text-[${COLORS.RDC_BLUE}] truncate`}>
                  Suivi <span className={`text-[${COLORS.RDC_YELLOW}]`}>RDC</span>
                </h1>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                  <RefreshCw size={10} className={isSyncing ? "animate-spin text-blue-500" : ""} />
                  <span className="hidden sm:inline">{lastSync}</span>
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <button onClick={loadFromCloud} className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all" title="Importer">
                <CloudDownload size={18} className="text-slate-600" />
              </button>
              <button onClick={saveToCloud} className={`p-2.5 bg-emerald-500 rounded-lg text-white hover:bg-emerald-600 transition-all ${isSyncing ? 'opacity-50' : ''}`} title="Sauvegarder">
                <Cloud size={18} />
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2.5 bg-white border border-slate-200 rounded-lg hover:text-blue-500 transition-all" title="Paramètres">
                <Settings size={18} className="text-slate-400" />
              </button>
              <button onClick={() => section === 'universites' ? ajouterUniversite() : ajouterEcole()} className={`p-2.5 bg-[${COLORS.RDC_BLUE}] rounded-lg text-white hover:shadow-lg transition-all`} title="Ajouter">
                <Plus size={18} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2.5 bg-white border border-slate-200 rounded-lg">
              <Menu size={18} className="text-slate-600" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 flex gap-2 pb-4">
              <button onClick={loadFromCloud} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
                <CloudDownload size={16} /> Importer
              </button>
              <button onClick={saveToCloud} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 rounded-lg text-sm font-bold text-white hover:bg-emerald-600 ${isSyncing ? 'opacity-50' : ''}`}>
                <Cloud size={16} /> Sauvegarder
              </button>
              <button onClick={() => section === 'universites' ? ajouterUniversite() : ajouterEcole()} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[${COLORS.RDC_BLUE}] rounded-lg text-sm font-bold text-white hover:shadow-lg`}>
                <Plus size={16} /> Ajouter
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
        {section === 'universites' ? (
          <UniversitesSection
            data={universites}
            stats={statsUniv}
            isSyncing={isSyncing}
            onEdit={modifierUniversite}
            onDelete={supprimerUniversite}
            onAdd={ajouterUniversite}
            onSave={saveToCloud}
            onLoad={loadFromCloud}
          />
        ) : (
          <EcolesSection
            data={ecoles}
            stats={statsEcoles}
            onEdit={modifierEcole}
            onDelete={supprimerEcole}
          />
        )}
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-100 shadow-lg">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setSection('universites')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-4 transition-all ${
              section === 'universites'
                ? `bg-[${COLORS.RDC_BLUE}] text-white`
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <GraduationCap size={20} />
            <span className="text-xs font-bold">Universités</span>
          </button>
          <button
            onClick={() => setSection('ecoles')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-4 transition-all ${
              section === 'ecoles'
                ? `bg-[${COLORS.RDC_BLUE}] text-white`
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={20} />
            <span className="text-xs font-bold">Écoles</span>
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-800">À propos</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2 mb-6">
                <div className="text-sm font-bold text-blue-900">✅ Connecté à Firebase</div>
                <div className="text-sm font-bold text-blue-900">📊 Firestore Database</div>
                <div className="text-sm font-bold text-blue-900">🔄 {lastSync}</div>
              </div>

              <button onClick={() => setShowSettings(false)} className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
