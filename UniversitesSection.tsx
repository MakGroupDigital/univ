import React from 'react';
import { Trash2, Plus, Cloud, CloudDownload } from 'lucide-react';
import { Universite, Stats } from './types';
import { COLORS } from './constants';

interface UniversitesSectionProps {
  data: Universite[];
  stats: Stats;
  isSyncing: boolean;
  onEdit: (id: number, champ: keyof Universite, valeur: string) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export const UniversitesSection: React.FC<UniversitesSectionProps> = ({
  data,
  stats,
  isSyncing,
  onEdit,
  onDelete,
  onAdd,
  onSave,
  onLoad
}) => {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <StatCard title="Total" value={stats.total} color={COLORS.RDC_BLUE} />
        <StatCard title="Envoyés" value={stats.envoyes} color={COLORS.RDC_YELLOW} textColor="text-slate-900" />
        <StatCard title="Réponses" value={stats.reponses} color={COLORS.RDC_RED} />
      </div>

      {/* Table */}
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
                <UniversiteRow key={item.id} item={item} idx={idx} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<any> = ({ title, value, color, textColor = "text-white" }) => (
  <div className={`p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 ${textColor}`} style={{ backgroundColor: color }}>
    <div className="text-xs md:text-sm font-bold opacity-80">{title}</div>
    <div className="text-2xl md:text-3xl font-black">{value}</div>
  </div>
);

const UniversiteRow: React.FC<any> = ({ item, idx, onEdit, onDelete }) => (
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
