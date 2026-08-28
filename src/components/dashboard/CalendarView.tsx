import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Filter,
  Plus,
  Video,
  CheckCircle2,
  Clock,
  ChevronRight,
  Download,
  Share2,
  Layers,
  Check,
  Edit2,
  FileText
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card, CardHeader } from '../common/Card';
import { Modal } from '../common/Modal';
import { GoogleDocsExportModal } from '../common/GoogleDocsExportModal';
import { useApp } from '../../context/AppContext';
import { CalendarDayItem } from '../../types';

export const CalendarView: React.FC = () => {
  const {
    calendarItems,
    setCalendarItems,
    updateCalendarItemStatus,
    updateCalendarItem,
    business,
    setActiveTab,
    setSelectedCalendarEventForContent,
    addToast
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [platformFilter, setPlatformFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<CalendarDayItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const filteredItems = calendarItems.filter((item) => {
    const matchesPlatform = platformFilter === 'Todas' || item.platform === platformFilter;
    const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter;
    return matchesPlatform && matchesStatus;
  });

  const handleExportCalendar = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Dia,DiaSemana,Plataforma,Formato,Tema,Objetivo,CTA,Estado\n' +
      calendarItems
        .map(
          (i) =>
            `"${i.day}","${i.dayName}","${i.platform}","${i.format}","${i.topic.replace(/"/g, '""')}","${i.objective}","${i.cta.replace(/"/g, '""')}","${i.status}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `calendario_marketing_30_dias_${business?.name || 'marketia'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({ type: 'success', title: 'Calendario exportado en formato CSV' });
  };

  const handleSaveEdit = () => {
    if (!selectedItemForEdit) return;
    updateCalendarItem(selectedItemForEdit.id, selectedItemForEdit);
    setEditModalOpen(false);
  };

  const platforms = ['Todas', 'Instagram', 'TikTok', 'WhatsApp', 'LinkedIn', 'Email'];
  const statuses = ['Todos', 'Idea', 'Pendiente', 'En progreso', 'Publicado'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] font-display">
              Calendario de Marketing a 30 Días
            </h1>
            <Badge variant="primary" size="sm">
              Planificado con IA
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
            Cada día tiene un objetivo claro, plataforma recomendada y llamado a la acción.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            className="bg-[#4285F4] hover:bg-[#3367D6] text-white border-transparent shadow-2xs"
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => setExportModalOpen(true)}
          >
            Exportar a Google Docs
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCalendar}
          >
            Exportar CSV
          </Button>

          <div className="flex items-center p-1 bg-[#FAF9F6] border border-[#EAE7DF] rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
              }`}
            >
              Cuadrícula
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#737373]'
              }`}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EAE7DF] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#737373] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Plataforma:
          </span>
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                platformFilter === p
                  ? 'bg-[#6C5CE7] text-white font-bold'
                  : 'bg-[#FAF9F6] text-[#525252] hover:bg-[#F2EFEB]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#737373] font-semibold">Estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-[#EAE7DF] text-xs bg-[#FAF9F6] outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main View: Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isDone = item.status === 'Publicado';
            const isProgress = item.status === 'En progreso';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-3 ${
                  isDone
                    ? 'border-[#22C55E]/30 bg-[#22C55E]/5'
                    : isProgress
                    ? 'border-[#6C5CE7]/30 bg-[#6C5CE7]/5 shadow-xs'
                    : 'border-[#EAE7DF] hover:border-[#D0CCC0]'
                }`}
              >
                <div>
                  {/* Top Day Badge & Format */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#6C5CE7]">
                      Día {item.day} • {item.dayName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE7DF] text-[#737373] font-semibold truncate">
                      {item.platform} • {item.format}
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h4 className="font-bold text-xs sm:text-sm text-[#171717] mt-2 line-clamp-2 leading-snug">
                    {item.topic}
                  </h4>

                  {/* Objective & CTA preview */}
                  <div className="mt-2 space-y-1 text-[11px] text-[#737373]">
                    <p className="truncate">🎯 {item.objective}</p>
                    <p className="truncate text-[#6C5CE7]">👉 {item.cta}</p>
                  </div>
                </div>

                {/* Bottom Actions & Status Dropdown */}
                <div className="pt-2 border-t border-[#EAE7DF] flex items-center justify-between gap-2">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateCalendarItemStatus(item.id, e.target.value as CalendarDayItem['status'])
                    }
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md border border-[#EAE7DF] bg-white text-[#171717] outline-none cursor-pointer"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Publicado">Publicado</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedItemForEdit(item);
                        setEditModalOpen(true);
                      }}
                      className="p-1 rounded-md text-[#737373] hover:text-[#171717] hover:bg-black/5"
                      title="Editar datos"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCalendarEventForContent(item);
                        if (item.format.toLowerCase().includes('reel')) {
                          setActiveTab('reels');
                        } else {
                          setActiveTab('content');
                        }
                      }}
                      className="text-[11px] font-bold text-[#6C5CE7] hover:underline flex items-center gap-0.5 cursor-pointer ml-1"
                    >
                      Crear copy →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white border border-[#EAE7DF] hover:border-[#D0CCC0] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7] font-extrabold text-sm flex items-center justify-center shrink-0">
                  {item.day}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#171717]">{item.dayName}</span>
                    <Badge variant="primary" size="sm">
                      {item.platform}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {item.format}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#171717] truncate mt-0.5">
                    {item.topic}
                  </p>
                  <p className="text-[11px] text-[#737373] truncate">
                    Objetivo: {item.objective} • CTA: {item.cta}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <select
                  value={item.status}
                  onChange={(e) =>
                    updateCalendarItemStatus(item.id, e.target.value as CalendarDayItem['status'])
                  }
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#EAE7DF] bg-white outline-none"
                >
                  <option value="Idea">Idea</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Publicado">Publicado</option>
                </select>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedCalendarEventForContent(item);
                    if (item.format.toLowerCase().includes('reel')) {
                      setActiveTab('reels');
                    } else {
                      setActiveTab('content');
                    }
                  }}
                >
                  Crear Copy
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Item Modal */}
      {selectedItemForEdit && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Editar Publicación - Día ${selectedItemForEdit.day}`}
          subtitle="Modificá el tema, formato o llamado a la acción de este día."
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Tema / Título de la publicación
              </label>
              <input
                type="text"
                value={selectedItemForEdit.topic}
                onChange={(e) =>
                  setSelectedItemForEdit({ ...selectedItemForEdit, topic: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Plataforma</label>
                <input
                  type="text"
                  value={selectedItemForEdit.platform}
                  onChange={(e) =>
                    setSelectedItemForEdit({ ...selectedItemForEdit, platform: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Formato</label>
                <input
                  type="text"
                  value={selectedItemForEdit.format}
                  onChange={(e) =>
                    setSelectedItemForEdit({ ...selectedItemForEdit, format: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Llamado a la acción</label>
              <input
                type="text"
                value={selectedItemForEdit.cta}
                onChange={(e) =>
                  setSelectedItemForEdit({ ...selectedItemForEdit, cta: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAE7DF] text-xs focus:border-[#6C5CE7] outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Google Docs Export Modal */}
      {business && (
        <GoogleDocsExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          exportPayload={{
            type: 'calendar',
            data: { business, calendar: calendarItems }
          }}
        />
      )}
    </div>
  );
};
