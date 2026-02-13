import React, { useState, useEffect } from 'react';
import { 
  Download, Plus, Trash2, GraduationCap, 
  Send, CheckCircle, Cloud, Settings,
  RefreshCw, X, CloudDownload, Menu
} from 'lucide-react';
import { Universite, Stats } from './types';
import { COLORS, STORAGE_KEY } from './constants';
import { db } from './firebase.config';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch, onSnapshot } from 'firebase/firestore';
import { InstallPrompt } from './InstallPrompt';

const initialData: Universite[] = [
  { id: 1, nom: "Université de Kinshasa", ville: "Kinshasa", statut: "Envoyé", reponse: "En attente", observation: "Dossier déposé au rectorat" },
  { id: 2, nom: "UNILU", ville: "Lubumbashi", statut: "En préparation", reponse: "-", observation: "Attente relevés de notes" },
  { id: 3, nom: "Université de Liège", ville: "Liège", statut: "Envoyé", reponse: "Positive", observation: "Bourse d'étude confirmée" }
];

const App: React.FC = () => {
  const [data, setData] = useState<Universite[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [stats, setStats] = useState<Stats>({ total: 0, envoyes: 0, reponses: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastSync, setLastSync] = useState(() => localStorage.getItem('last_sync_date') || 'Jamais');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const validData = data.filter(item => item.nom.trim() !== "");
    setStats({
      total: validData.length,
      envoyes: data.filter(item => item.statut === "Envoyé").length,
      reponses: data.filter(item => ["Positive", "Négative"].includes(item.reponse)).length
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Écouter les changements Firebase en temps réel
  useEffect(() => {
    const universiteRef = collection(db, 'universites');
    
    const unsubscribe = onSnapshot(universiteRef, (snapshot) => {
      if (!snapshot.empty) {
        const cloudData: Universite[] = snapshot.docs.map(doc => ({
          id: doc.data().id,
          nom: doc.data().nom,
          ville: doc.data().ville,
          statut: doc.data().statut,
          reponse: doc.data().reponse,
          observation: doc.data().observation
        }));
        
        const localData = localStorage.getItem(STORAGE_KEY);
        const localDataParsed = localData ? JSON.parse(localData) : [];
        
        if (JSON.stringify(cloudData) !== JSON.stringify(localDataParsed)) {
          console.log('🔄 Mise à jour depuis Firebase');
          setData(cloudData);
        }
      }
    }, (error) => {
      console.log('ℹ️ Listener Firebase:', error.message);
    });

    return () => unsubscribe();
  }, []);

  const modifierLigne = (id: number, champ: keyof Universite, valeur: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, [champ]: valeur } : item));
  };

  const ajouterLigne = () => {
    const nouvelId = data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1;
    setData(prev => [...prev, { id: nouvelId, nom: "", ville: "", statut: "Non envoyé", reponse: "-", observation: "" }]);
    setMobileMenuOpen(false);
  };

  const supprimerLigne = (id: number) => {
    if (window.confirm("Supprimer cette ligne ?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const saveToCloud = async () => {
    setIsSyncing(true);
    try {
      const universiteRef = collection(db, 'universites');
      
      const existingDocs = await getDocs(universiteRef);
      const batch = writeBatch(db);
      existingDocs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      for (const row of data) {
        await addDoc(universiteRef, {
          id: row.id,
          nom: row.nom,
          ville: row.ville,
          statut: row.statut,
          reponse: row.reponse,
          observation: row.observation,
          createdAt: new Date()
        });
      }

      const now = new Date().toLocaleString('fr-FR');
      setLastSync(now);
      localStorage.setItem('last_sync_date', now);
      alert("✓ Données sauvegardées dans Firebase !");
    } catch (error) {
      alert("Erreur : " + (error instanceof Error ? error.message : "Erreur lors de la sauvegarde"));
    } finally {
      setIsSyncing(false);
    }
  };

  const loadFromCloud = async () => {
    setIsSyncing(true);
    try {
      const universiteRef = collection(db, 'universites');
      const snapshot = await getDocs(universiteRef);

      if (!snapshot.empty) {
        const cloudData: Universite[] = snapshot.docs.map(doc => ({
          id: doc.data().id,
          nom: doc.data().nom,
          ville: doc.data().ville,
          statut: doc.data().statut,
          reponse: doc.data().reponse,
          observation: doc.data().observation
        }));

        setData(cloudData);
        const now = new Date().toLocaleString('fr-FR');
        setLastSync(now);
        localStorage.setItem('last_sync_date', now);
        alert("✓ Données importées depuis Firebase !");
      } else {
        alert("Aucune donnée trouvée.");
      }
    } catch (error) {
      alert("Erreur : " + (error instanceof Error ? error.message : "Erreur lors du chargement"));
    } finally {
      setIsSyncing(false);
    }
  };

  const exporterExcel = () => {
    const headers = "ID,Université,Ville,Statut,Réponse,Observation\n";
    const csvContent = data.map(i => `${i.id},"${i.nom}","${i.ville}","${i.statut}","${i.reponse}","${i.observation}"`).join("\n");
    const blob = new Blob(["\uFEFF" + headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `export_rdc.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <InstallPrompt />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-2 h-10 bg-[${COLORS.RDC_RED}] rounded-full`}></div>
              <div className="min-w-0">
                <h1 className={`text-lg md:text-2xl font-black text-[${COLORS.RDC_BLUE}] truncate`}>
                  Suivi <span className={`text-[${COLORS.RDC_YELLOW}]`}>Univ</span>
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
              <button onClick={ajouterLigne} className={`p-2.5 bg-[${COLORS.RDC_BLUE}] rounded-lg text-white hover:shadow-lg transition-all`} title="Ajouter">
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
              <button onClick={ajouterLigne} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[${COLORS.RDC_BLUE}] rounded-lg text-sm font-bold text-white hover:shadow-lg`}>
                <Plus size={16} /> Ajouter
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-4 md:py-6">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <StatCard title="Total" value={stats.total} color={COLORS.RDC_BLUE} />
          <StatCard title="Envoyés" value={stats.envoyes} color={COLORS.RDC_YELLOW} textColor="text-slate-900" />
          <StatCard title="Réponses" value={stats.reponses} color={COLORS.RDC_RED} />
        </div>
      </div>

      {/* Table */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-xs md:text-sm">
                  <th className="p-2 md:p-4 text-center font-bold text-slate-600 w-8 md:w-12">#</th>
                  <th className="p-2 md:p-4 text-left font-bold text-slate-600">Établissement</th>
                  <th className="p-2 md:p-4 text-left font-bold text-slate-600 hidden sm:table-cell">Ville</th>
                  <th className="p-2 md:p-4 text-left font-bold text-slate-600 hidden md:table-cell">Statut</th>
                  <th className="p-2 md:p-4 text-left font-bold text-slate-600 hidden lg:table-cell">Réponse</th>
                  <th className="p-2 md:p-4 text-left font-bold text-slate-600 hidden xl:table-cell">Notes</th>
                  <th className="p-2 md:p-4 w-8 md:w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((item, idx) => (
                  <ApplicationRow key={item.id} item={item} idx={idx} onEdit={modifierLigne} onDelete={supprimerLigne} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

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

const StatCard: React.FC<any> = ({ title, value, color, textColor = "text-white" }) => (
  <div className={`p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 ${textColor}`} style={{ backgroundColor: color }}>
    <div className="text-xs md:text-sm font-bold opacity-80">{title}</div>
    <div className="text-2xl md:text-3xl font-black">{value}</div>
  </div>
);

const ApplicationRow: React.FC<any> = ({ item, idx, onEdit, onDelete }) => (
  <tr className="hover:bg-blue-50/40 group transition-all text-xs md:text-sm">
    <td className="p-2 md:p-4 text-center font-bold text-slate-300">{idx + 1}</td>
    <td className="p-2 md:p-4 font-bold text-slate-800">
      <input 
        type="text" 
        value={item.nom} 
        onChange={(e) => onEdit(item.id, 'nom', e.target.value)} 
        placeholder="..." 
        className="bg-transparent outline-none w-full border-b border-transparent focus:border-blue-400 text-xs md:text-sm"
      />
    </td>
    <td className="p-2 md:p-4 text-slate-600 hidden sm:table-cell">
      <input 
        type="text" 
        value={item.ville} 
        onChange={(e) => onEdit(item.id, 'ville', e.target.value)} 
        placeholder="..." 
        className="bg-transparent outline-none w-full text-xs md:text-sm"
      />
    </td>
    <td className="p-2 md:p-4 hidden md:table-cell">
      <select 
        value={item.statut} 
        onChange={(e) => onEdit(item.id, 'statut', e.target.value)} 
        className="p-1 rounded-lg text-xs font-bold border border-slate-100 bg-white outline-none"
      >
        <option value="Non envoyé">NON ENVOYÉ</option>
        <option value="En préparation">PRÉPAR.</option>
        <option value="Envoyé">ENVOYÉ</option>
      </select>
    </td>
    <td className="p-2 md:p-4 hidden lg:table-cell">
      <select 
        value={item.reponse} 
        onChange={(e) => onEdit(item.id, 'reponse', e.target.value)} 
        className={`p-1 rounded-lg text-xs font-bold border outline-none ${item.reponse === 'Positive' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : item.reponse === 'Négative' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-transparent border-slate-100'}`}
      >
        <option value="-">-</option>
        <option value="En attente">ATTENTE</option>
        <option value="Positive">OUI</option>
        <option value="Négative">NON</option>
      </select>
    </td>
    <td className="p-2 md:p-4 text-slate-400 hidden xl:table-cell">
      <input 
        type="text" 
        value={item.observation} 
        onChange={(e) => onEdit(item.id, 'observation', e.target.value)} 
        className="bg-transparent outline-none w-full text-xs md:text-sm"
      />
    </td>
    <td className="p-2 md:p-4 text-center opacity-0 group-hover:opacity-100 transition-all">
      <button onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);

export default App;
