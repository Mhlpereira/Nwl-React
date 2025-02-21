import { MapPin, Calendar, Settings2 } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ChangeLD } from "./create-changeld-modal";
import { DateRange } from "react-day-picker";


interface Trip {
    id: string
    destination: string
    starts_at: string
    ends_at: string
    is_confirmed: boolean
}



export function DestinationAndDateHeader() {
    const { tripId } = useParams()
    const [trip, setTrip] = useState<Trip | undefined>()


    {/* utilizado para carregar a data apenas se for alterado o tripId*/}
    useEffect (() => {
        api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
    }, [tripId])
    
    const [isChangeLDModalOpen, setIsChangeLDModalOpen] = useState(false)
    const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()
    

    function openChangeLDModal() {
        setIsChangeLDModalOpen(true)
    }

    function closeChangeLDModal() {
        setIsChangeLDModalOpen(false)
    }


    const displayedDate = trip
    ? format(trip.starts_at, "d ' de ' LLL").concat( ' até ').concat(format(trip.ends_at, "d ' de ' LLL")) : null
    
    return (
        <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
            <div className="flex items-center gap-2">
                <MapPin className="size-5 text-zinc-400" />
                <span className="text-lg text-zinc-100"> {trip?.destination}</span>
            </div>

            <div className="flex  items-center gap-5">
                <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-zinc-400" />
                    <span className="text-lg text-zinc-100">{displayedDate}</span>
                </div>

                <div className="w-px h-6 bg-zinc-800" />

                <Button onClick={openChangeLDModal} disabled={isChangeLDModalOpen} variant="secundary">
                    Alterar local/data
                    <Settings2 className="size-5" />
                </Button>
            </div>


            {isChangeLDModalOpen && (
                <ChangeLD 
                closeChangeLDModal={closeChangeLDModal}
                setEventStartAndEndDates={setEventStartAndEndDates} 
                eventStartAndEndDates={eventStartAndEndDates}
                isChangeLDModalOpen={isChangeLDModalOpen}
                />
            )}
        </div>
    )
}