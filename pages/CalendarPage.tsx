
import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui/Common';
import { STATUS_COLORS } from '../constants';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { Site } from '../types';
import { useLimitCheck } from '../hooks/useLimitCheck';

type CalendarView = 'day' | 'week' | 'month' | 'year';

export const CalendarPage = () => {
  const { data: sites, loading } = useFirestore<Site>('sites');
  const { isLimitReachedOnDate } = useLimitCheck(sites);
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8h to 18h

  const changeDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (currentView === 'month' || currentView === 'year') {
       newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (currentView === 'week') {
       newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
       newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getSiteForDate = (dateToCheck: Date) => {
     return sites.filter(site => {
        const start = new Date(site.startDate);
        const end = new Date(site.endDate);
        const checkDate = new Date(dateToCheck);
        checkDate.setHours(0,0,0,0);
        const check = checkDate.getTime();
        
        const sStart = new Date(start);
        sStart.setHours(0,0,0,0);
        const sEnd = new Date(end);
        sEnd.setHours(23,59,59,999);
        
        return check >= sStart.getTime() && check <= sEnd.getTime();
     });
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  const renderYearView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 overflow-y-auto">
      {months.map((month, mIdx) => {
         const monthSites = sites.filter(site => {
            const start = new Date(site.startDate);
            const end = new Date(site.endDate);
            const currentYear = currentDate.getFullYear();
            const monthStart = new Date(currentYear, mIdx, 1);
            const monthEnd = new Date(currentYear, mIdx + 1, 0);
            return start <= monthEnd && end >= monthStart;
         });
         
         return (
          <div key={month} className="border border-gray-200 rounded-xl p-0 hover:shadow-md transition-shadow bg-white flex flex-col h-[200px]">
             <div className="bg-gray-50 p-3 border-b border-gray-100 rounded-t-xl">
                <h3 className="font-bold text-neutralDark">{month}</h3>
             </div>
             
             <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-2">
                {monthSites.length > 0 ? (
                   monthSites.map((site, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm group cursor-pointer">
                         <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_COLORS[site.status] ? STATUS_COLORS[site.status].replace('bg-', 'bg-').split(' ')[0] : 'bg-gray-400'}`}></div>
                         <span className="truncate text-gray-600 group-hover:text-primary transition-colors font-medium">
                            {site.name}
                         </span>
                      </div>
                   ))
                ) : (
                   <div className="text-xs text-gray-400 italic text-center mt-4">Aucun chantier</div>
                )}
             </div>
          </div>
         );
      })}
    </div>
  );

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const totalSlots = Math.ceil((daysInMonth + startOffset) / 7) * 7;
    const gridDays = Array.from({ length: totalSlots });

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {days.map(d => (
              <div key={d} className="py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                {d}
              </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-white">
          {gridDays.map((_, i) => {
            const dayNum = i - startOffset + 1;
            const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
            let dateObj = new Date(year, month, dayNum);
            const events = isCurrentMonth ? getSiteForDate(dateObj) : [];
            const isDayAtLimit = isCurrentMonth && isLimitReachedOnDate(dateObj);

            return (
              <div key={i} className={`min-h-[100px] border-b border-r border-gray-100 p-2 relative transition-colors ${!isCurrentMonth ? 'bg-gray-50/30' : 'bg-white hover:bg-gray-50'}`}>
                <span className={`text-sm font-medium ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}`}>
                  {isCurrentMonth ? dayNum : ''}
                </span>
                <div className="mt-1 space-y-1">
                    {events.map((site) => (
                      <div key={site.id} className={`text-xs p-1 px-2 rounded border-l-2 truncate cursor-pointer transition-all hover:scale-105 flex items-center justify-between ${isDayAtLimit ? 'limit-halo bg-red-50 border-danger text-danger' : (STATUS_COLORS[site.status] ? STATUS_COLORS[site.status].replace('bg-', 'bg-opacity-20 bg-') : 'bg-gray-100 border-gray-300')}`}>
                        <span className="truncate">{site.name}</span>
                        {isDayAtLimit && <AlertTriangle size={10} className="ml-1 shrink-0 animate-pulse" />}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
     const tempDate = new Date(currentDate);
     const day = tempDate.getDay();
     const diff = tempDate.getDate() - day + (day === 0 ? -6 : 1);
     const monday = new Date(tempDate.setDate(diff));
     
     const weekDates = Array.from({length: 7}, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
     });

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
          <div className="p-3 border-r border-gray-200 text-center text-xs text-gray-400 font-medium">GMT+2</div>
          {days.map((d, i) => (
              <div key={d} className="py-3 text-center border-r border-gray-200 last:border-r-0">
                 <div className="text-xs font-semibold text-gray-500 uppercase">{d}</div>
                 <div className={`text-lg font-bold ${
                    weekDates[i].getDate() === new Date().getDate() && weekDates[i].getMonth() === new Date().getMonth()
                    ? 'text-primary bg-secondary rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                    : 'text-neutralDark'
                 }`}>
                   {weekDates[i].getDate()}
                 </div>
              </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
           <div className="grid grid-cols-8 h-[600px]">
              <div className="border-r border-gray-100">
                 {hours.map(h => (
                    <div key={h} className="h-[60px] border-b border-gray-100 text-xs text-gray-400 flex items-start justify-center pt-2">
                       {h}:00
                    </div>
                 ))}
              </div>
              
              {weekDates.map((date, dayIdx) => {
                 const dayEvents = getSiteForDate(date);
                 const isDayAtLimit = isLimitReachedOnDate(date);
                 return (
                  <div key={dayIdx} className="border-r border-gray-100 relative">
                     {hours.map(h => <div key={h} className="h-[60px] border-b border-gray-100/50"></div>)}
                     
                     {dayEvents.map((site, idx) => (
                        <div 
                           key={site.id}
                           className={`absolute left-1 right-1 rounded p-2 cursor-pointer hover:opacity-90 transition-opacity z-10 overflow-hidden border-l-4 ${isDayAtLimit ? 'limit-halo bg-red-100 border-danger text-danger' : 'bg-blue-100 border-blue-500 text-blue-800'}`}
                           style={{
                              top: `${(idx * 120) + 10}px`, 
                              height: '100px'
                           }}
                        >
                           <div className="flex justify-between items-start">
                              <div className="text-xs font-bold truncate">{site.name}</div>
                              {isDayAtLimit && <AlertTriangle size={14} className="animate-pulse" />}
                           </div>
                           <div className={`text-[10px] flex items-center gap-1 mt-1 truncate ${isDayAtLimit ? 'text-danger/80' : 'text-blue-600'}`}>
                              <MapPin size={10}/> {site.address}
                           </div>
                        </div>
                     ))}
                  </div>
                 );
              })}
           </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
     const dayEvents = getSiteForDate(currentDate);
     const isDayAtLimit = isLimitReachedOnDate(currentDate);

     return (
    <div className="flex h-full overflow-hidden bg-white">
       <div className="w-20 flex-shrink-0 border-r border-gray-200 overflow-y-auto custom-scrollbar bg-gray-50">
          {hours.map(h => (
             <div key={h} className="h-32 border-b border-gray-200 flex items-start justify-center pt-4 text-sm font-medium text-gray-500">
                {h}:00
             </div>
          ))}
       </div>
       
       <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
          <div className="space-y-4">
             {dayEvents.length > 0 ? dayEvents.map((site, i) => (
                <div key={site.id} className={`relative h-28 border rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer ${isDayAtLimit ? 'limit-halo bg-red-50 border-danger' : 'bg-blue-50 border-blue-200'}`}>
                   <div className={`w-1 rounded-full h-full ${isDayAtLimit ? 'bg-danger' : 'bg-blue-500'}`}></div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <h4 className={`font-bold text-lg ${isDayAtLimit ? 'text-danger' : 'text-blue-900'}`}>{site.name}</h4>
                         <div className="flex items-center gap-2">
                            {isDayAtLimit && <Badge className="bg-danger text-white border-none animate-pulse">CAPACITÉ DÉPASSÉE</Badge>}
                            <span className={`text-xs px-2 py-1 rounded font-bold ${isDayAtLimit ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'}`}>Journée entière</span>
                         </div>
                      </div>
                      <p className={`mt-1 flex items-center gap-2 text-sm ${isDayAtLimit ? 'text-red-700' : 'text-blue-700'}`}>
                        <MapPin size={16}/> {site.address}
                      </p>
                   </div>
                </div>
             )) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                   <Calendar size={48} className="mb-4" />
                   <p>Aucun chantier prévu ce jour.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
         <div>
            <h2 className="text-2xl font-bold font-heading text-neutralDark">Calendrier</h2>
            <p className="text-gray-500">Planification des équipes et des chantiers.</p>
         </div>
         
         <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="bg-gray-100 p-1 rounded-lg flex items-center">
               {(['day', 'week', 'month', 'year'] as CalendarView[]).map((view) => (
                  <button
                     key={view}
                     onClick={() => setCurrentView(view)}
                     className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        currentView === view 
                        ? 'bg-white text-primary shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                     }`}
                  >
                     {view === 'day' ? 'Jour' : view === 'week' ? 'Semaine' : view === 'month' ? 'Mois' : 'Année'}
                  </button>
               ))}
            </div>

            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
               <button onClick={() => changeDate('prev')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><ChevronLeft size={18}/></button>
               <span className="px-3 font-bold text-neutralDark text-sm min-w-[120px] text-center capitalize">
                  {currentView === 'year' 
                     ? currentDate.getFullYear() 
                     : currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
               </span>
               <button onClick={() => changeDate('next')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><ChevronRight size={18}/></button>
            </div>
            
            <Button className="flex items-center gap-2 ml-auto">
               <Plus size={18} /> <span className="hidden sm:inline">Événement</span>
            </Button>
         </div>
      </div>

      <Card className="flex-1 p-0 overflow-hidden flex flex-col min-h-[500px] shadow-sm border border-gray-200">
         {currentView === 'year' && renderYearView()}
         {currentView === 'month' && renderMonthView()}
         {currentView === 'week' && renderWeekView()}
         {currentView === 'day' && renderDayView()}
      </Card>
    </div>
  );
};
