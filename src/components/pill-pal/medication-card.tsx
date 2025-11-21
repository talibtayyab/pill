'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BellRing, Pill, Stethoscope, Clock, MapPin } from 'lucide-react';
import type { ExtractMedicationDetailsOutput } from '@/ai/flows/extract-medication-details';

interface MedicationCardProps {
  medication: ExtractMedicationDetailsOutput;
}

export function MedicationCard({ medication }: MedicationCardProps) {
  const { toast } = useToast();
  const [intake, setIntake] = useState({ morning: false, noon: false, night: false });
  const [allTaken, setAllTaken] = useState(false);
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    const allChecked = Object.values(intake).every(Boolean);
    setAllTaken(allChecked);
  }, [intake]);

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

        <div className="space-y-2">
          <h4 className="font-semibold">Daily Intake Log</h4>
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="morning" checked={intake.morning} onCheckedChange={(checked) => setIntake(prev => ({...prev, morning: !!checked}))} />
              <Label htmlFor="morning">Morning</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="noon" checked={intake.noon} onCheckedChange={(checked) => setIntake(prev => ({...prev, noon: !!checked}))} />
              <Label htmlFor="noon">Noon</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="night" checked={intake.night} onCheckedChange={(checked) => setIntake(prev => ({...prev, night: !!checked}))} />
              <Label htmlFor="night">Night</Label>
            </div>
          </div>
        </div>
      </CardContent>
      {allTaken && (
        <CardFooter>
          <Button onClick={findPharmacies} className="w-full">
            <MapPin className="mr-2 h-4 w-4" />
            Find Nearby Pharmacies
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
