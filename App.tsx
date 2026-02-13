import React, { useState, useEffect } from 'react';
import { 
  Download, Plus, Trash2, GraduationCap, 
  Send, CheckCircle, Cloud, Settings,
  RefreshCw, X, CloudDownload
} from 'lucide-react';
import { Universite, Stats } from './types';
import { COLORS, STORAGE_KEY } from './constants';
import { db } from './firebase.config';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch, onSnapshot } from 'firebase/firestore';

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
        
        // Mettre à jour les données locales si elles ont changé
        const localData = localStorage.getItem(STORAGE_KEY);
        const localDataParsed = localData ? JSON.parse(localData) : [];
        
        // Comparer et mettre à jour si différent
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

  useEffect(() => {
    const validData = data.filter(item => item.nom.trim() !== "");
    setStats({
      total: validData.length,
      envoyes: data.filter(item => item.statut === "Envoyé").length,
      reponses: data.filter(item => ["Positive", "Négative"].includes(item.reponse)).length
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const modifierLigne = (id: number, champ: keyof Universite, valeur: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, [champ]: valeur } : item));
  };

  const ajouterLigne = () => {
    const nouvelId = data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1;
    setData(prev => [...prev, { id: nouvelId, nom: "", ville: "", statut: "Non envoyé", reponse: "-", observation: "" }]);
  };

  const supprimerLigne = (id: number) => {
    if (window.confirm("Supprimer cette ligne ?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  // SAUVEGARDER VERS FIREBASE
  const saveToCloud = async () => {
    setIsSyncing(true);
    try {
      const universiteRef = collection(db, 'universites');
      
      // Supprimer tous les documents existants
      const existingDocs = await getDocs(universiteRef);
      const batch = writeBatch(db);
      existingDocs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Ajouter les nouvelles données
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

  // CHARGER DEPUIS FIREBASE
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
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-16 bg-[${COLORS.RDC_RED}] rounded-full`}></div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black text-[${COLORS.RDC_BLUE}] tracking-tight uppercase`}>
                Suivi <span className={`text-[${COLORS.RDC_YELLOW}]`}>Universitaire</span>
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
                <RefreshCw size={12} className={isSyncing ? "animate-spin text-blue-500" : ""} />
                DERNIER SYNC : <span className="text-slate-600">{lastSync}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button onClick={loadFromCloud} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border-2 border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-bold">
              <CloudDownload size={20} /> <span className="hidden sm:inline">Importer</span>
            </button>
            <button onClick={saveToCloud} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 bg-emerald-500 px-5 py-2.5 rounded-xl text-white hover:bg-emerald-600 shadow-lg transition-all font-bold ${isSyncing ? 'opacity-50' : ''}`}>
              <Cloud size={20} /> <span>Sauvegarder</span>
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-400 hover:text-blue-500 transition-all"><Settings size={22} /></button>
            <button onClick={ajouterLigne} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[${COLORS.RDC_BLUE}] px-6 py-2.5 rounded-xl text-white shadow-xl font-bold active:scale-95`}>
              <Plus size={20} /> <span>Ajouter</span>
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total" value={stats.total} subtitle="Candidatures" color={COLORS.RDC_BLUE} icon={<GraduationCap size={120} />} />
          <StatCard title="Envoyés" value={stats.envoyes} subtitle="Dossiers transmis" color={COLORS.RDC_YELLOW} textColor="text-slate-900" icon={<Send size={120} />} />
          <StatCard title="Réponses" value={stats.reponses} subtitle="Décisions reçues" color={COLORS.RDC_RED} icon={<CheckCircle size={120} />} />
        </section>

        <main className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-100 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="p-5 text-center w-16">#</th>
                  <th className="p-5 text-left">Établissement</th>
                  <th className="p-5 text-left">Ville</th>
                  <th className="p-5 text-left">Statut</th>
                  <th className="p-5 text-left">Réponse</th>
                  <th className="p-5 text-left">Notes</th>
                  <th className="p-5 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((item, idx) => (
                  <ApplicationRow key={item.id} item={item} idx={idx} onEdit={modifierLigne} onDelete={supprimerLigne} />
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-all"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-2">À propos</h2>
            <p className="text-sm text-slate-500 mb-6">Suivi Universitaire RDC</p>
            <div className="space-y-6">
              <div className="text-[11px] text-blue-600 bg-blue-50 p-4 rounded-2xl border border-blue-100 leading-relaxed font-bold space-y-2">
                <div>✅ Connecté à Firebase</div>
                <div>📊 Base de données : Firestore</div>
                <div>📝 Collection : universites</div>
                <div>🔄 Dernier sync : {lastSync}</div>
              </div>
              
              <button onClick={() => setShowSettings(false)} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold active:scale-95 transition-all">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<any> = ({ title, value, subtitle, color, textColor = "text-white", icon }) => (
  <div className={`p-6 rounded-[2rem] shadow-lg relative overflow-hidden group ${textColor}`} style={{ backgroundColor: color }}>
     <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-all duration-500">{icon}</div>
     <div className="flex flex-col gap-1 relative z-10">
        <span className="font-bold uppercase text-[10px] tracking-[0.2em] opacity-80">{title}</span>
        <span className="text-5xl font-black">{value}</span>
        <span className="text-xs font-medium opacity-80">{subtitle}</span>
     </div>
  </div>
);

const ApplicationRow: React.FC<any> = ({ item, idx, onEdit, onDelete }) => (
  <tr className="hover:bg-blue-50/40 group transition-all">
    <td className="p-4 text-center font-black text-slate-300">{idx + 1}</td>
    <td className="p-4 font-bold text-slate-800">
      <input type="text" value={item.nom} onChange={(e) => onEdit(item.id, 'nom', e.target.value)} placeholder="..." className="bg-transparent outline-none w-full border-b border-transparent focus:border-blue-400" />
    </td>
    <td className="p-4 text-slate-600">
      <input type="text" value={item.ville} onChange={(e) => onEdit(item.id, 'ville', e.target.value)} placeholder="..." className="bg-transparent outline-none w-full" />
    </td>
    <td className="p-4">
      <select value={item.statut} onChange={(e) => onEdit(item.id, 'statut', e.target.value)} className="p-2 rounded-xl text-[10px] font-black uppercase border border-slate-100 bg-white outline-none">
        <option value="Non envoyé">NON ENVOYÉ</option>
        <option value="En préparation">⏳ PRÉPAR.</option>
        <option value="Envoyé">📤 ENVOYÉ</option>
      </select>
    </td>
    <td className="p-4">
      <select value={item.reponse} onChange={(e) => onEdit(item.id, 'reponse', e.target.value)} className={`p-2 rounded-xl text-[10px] font-black uppercase border outline-none ${item.reponse === 'Positive' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : item.reponse === 'Négative' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-transparent border-slate-100 text-slate-400'}`}>
        <option value="-">-</option>
        <option value="En attente">ATTENTE</option>
        <option value="Positive">✔ OUI</option>
        <option value="Négative">✘ NON</option>
      </select>
    </td>
    <td className="p-4 italic text-sm text-slate-400">
      <input type="text" value={item.observation} onChange={(e) => onEdit(item.id, 'observation', e.target.value)} className="bg-transparent outline-none w-full" />
    </td>
    <td className="p-4 text-center opacity-0 group-hover:opacity-100 transition-all">
      <button onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
    </td>
  </tr>
);

export default App;
