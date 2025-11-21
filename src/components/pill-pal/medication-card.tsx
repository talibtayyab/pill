'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BellRing, Pill, Stethoscope, Clock, MapPin, ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import type { MedicationDetail } from '@/ai/flows/extract-medication-details';
import { addDays, format, startOfDay, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface MedicationCardProps {
  medication: MedicationDetail;
}

type IntakeLog = {
  [date: string]: boolean[];
};

export function MedicationCard({ medication }: MedicationCardProps) {
  const { toast } = useToast();
  const [intakeLog, setIntakeLog] = useState<IntakeLog>({});
  const [reminderTime, setReminderTime] = useState('');
  const [currentWeek, setCurrentWeek] = useState(0);

  const { startDate, totalWeeks, datesByWeek, endDate } = useMemo(() => {
    const start = startOfDay(new Date());
    const duration = medication.duration || 7;
    const end = addDays(start, duration - 1); // -1 because duration includes start day
    const weeks = Math.ceil(duration / 7);
    const dates = Array.from({ length: weeks }, (_, weekIndex) =>
      Array.from({ length: 7 }, (__, dayIndex) => addDays(start, weekIndex * 7 + dayIndex))
    );
    return { startDate: start, totalWeeks: weeks, datesByWeek: dates, endDate: end };
  }, [medication.duration]);

  useEffect(() => {
    // Reset state when medication changes
    setIntakeLog({});
    setReminderTime('');
    setCurrentWeek(0);
  }, [medication]);

  const handleIntakeChange = (date: Date, intakeIndex: number, checked: boolean) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setIntakeLog(prev => {
      const newLog = { ...prev };
      if (!newLog[dateKey]) {
        newLog[dateKey] = Array(medication.frequency).fill(false);
      }
      newLog[dateKey][intakeIndex] = checked;
      return newLog;
    });
  };
  
  const totalDoses = medication.duration * medication.frequency;
  const takenDoses = Object.values(intakeLog).flat().filter(Boolean).length;
  const remainingDoses = totalDoses - takenDoses;
  const progress = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;
  const isRefillNeeded = remainingDoses <= 2;


  const findPharmacies = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/search/pharmacies/@${latitude},${longitude},15z`;
          window.open(url, '_blank');
        },
        () => {
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Could not get your location. Please enable location services.',
          });
        }
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Geolocation is not supported by your browser.',
      });
    }
  };

  const handleReminder = () => {
    if (!reminderTime) {
      toast({
        variant: "destructive",
        title: "No time set",
        description: "Please select a time for the reminder.",
      });
      return;
    }
    
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);
    
    let timeToReminder = reminderDate.getTime() - now.getTime();
    if (timeToReminder < 0) {
      reminderDate.setDate(reminderDate.getDate() + 1);
      timeToReminder = reminderDate.getTime() - now.getTime();
    }

    setTimeout(() => {
      toast({
        title: 'Medication Reminder',
        description: `Time to take your ${medication.medicationName}.`,
      });
    }, timeToReminder);

    toast({
      title: 'Reminder Set!',
      description: `We'll remind you to take ${medication.medicationName} at ${reminderTime}.`,
    });
  };
  
  const weekDates = datesByWeek[currentWeek] || [];


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Pill className="text-primary" />
          <span>Medication Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex-grow">
        <div>
          <h3 className="text-2xl font-bold">{medication.medicationName}</h3>
          <p className="text-muted-foreground flex items-center gap-2 mt-1"><Stethoscope size={16}/>{medication.dosage}</p>
          <p className="text-muted-foreground flex items-center gap-2"><Clock size={16}/>{medication.schedule}</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Set a Reminder</h4>
          <div className="flex items-center gap-2">
            <Input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="h-10" />
            <Button onClick={handleReminder} size="icon" variant="outline" aria-label="Set reminder">
              <BellRing />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h4 className="font-semibold">Daily Intake Log</h4>
             <span className="text-sm text-muted-foreground">{takenDoses} / {totalDoses} doses taken</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={() => setCurrentWeek(p => Math.max(0, p - 1))} disabled={currentWeek === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-center">
                <p>{format(weekDates[0], 'MMM d')} - {format(weekDates[weekDates.length-1], 'MMM d, yyyy')}</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => setCurrentWeek(p => Math.min(totalWeeks - 1, p + 1))} disabled={currentWeek === totalWeeks - 1}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
                {weekDates.map(date => (
                    <div key={date.toString()}>{format(date, 'E')}</div>
                ))}
            </div>
             <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  const dayLog = intakeLog[dateKey] || Array(medication.frequency).fill(false);
                  const isPast = date < startOfDay(new Date());

                  return (
                    <div key={dateKey} className={cn("p-2 rounded-md border flex flex-col items-center gap-2", isPast && "bg-muted/50")}>
                      <div className={cn("font-bold", date.toDateString() === new Date().toDateString() && "text-primary")}>
                        {format(date, 'd')}
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {Array.from({ length: medication.frequency }).map((_, i) => (
                          <Checkbox
                            key={i}
                            checked={dayLog[i]}
                            onCheckedChange={(checked) => handleIntakeChange(date, i, !!checked)}
                            disabled={isPast && !dayLog[i]}
                            className="h-3.5 w-3.5"
                            aria-label={`Intake ${i + 1} for ${format(date, 'MMMM d')}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 pt-4">
        {isRefillNeeded && (
            <Button onClick={findPharmacies} variant="outline" className="w-full bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100">
                <MapPin className="mr-2 h-4 w-4" /> Time to refill {medication.medicationName}, find nearby pharmacy
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
