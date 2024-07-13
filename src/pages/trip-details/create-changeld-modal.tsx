import { X, Calendar, Plus, MapPin } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "../../components/button";

interface ChangeLDProps {
    isChangeLDModalOpen: boolean
    eventStartAndEndDates: DateRange | undefined
    closeChangeLDModal: () => void
    setEventStartAndEndDates: (dates: DateRange | undefined) => void
}


export function ChangeLD({
    closeChangeLDModal,
    setEventStartAndEndDates,
    eventStartAndEndDates,
}: ChangeLDProps) {

    const { tripId } = useParams()
    const [newDestination , setNewDestination] = useState('')


    async function updateLD() {
        event?.preventDefault()
        
        const destination = newDestination

        const starts_at = eventStartAndEndDates?.from?.toISOString()

        const ends_at = eventStartAndEndDates?.to?.toISOString()

        await api.put(`/trips/${tripId}`, {
            destination,
            starts_at,
            ends_at
        })

        window.location.reload()
    }

    const [isDatePickerOpen, setDatePickerOpen] = useState(false)

    function openDatePicker() {
        return setDatePickerOpen(true)
    }

    function closeDatePicker() {
        return setDatePickerOpen(false)
    }

    const displayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to
        ? format(eventStartAndEndDates.from, "d ' de ' LLL").concat(' até ').concat(format(eventStartAndEndDates.to, "d ' de ' LLL")) : null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Alterar local e data</h2>
                        <button type="button" onClick={closeChangeLDModal} >
                            <X className="size-5 text-zinc-400" />
                        </button>
                    </div>
                </div>

                <form onSubmit={updateLD} className="space-y-3">
                    <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 ">
                        <MapPin className="text-zinc-400 size-5" />
                        <input name="destination" placeholder="Qual é novo local?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                            onChange={event => setNewDestination(event.target.value)} />

                    </div>

                    <button onClick={openDatePicker} className='flex items-center gap-2 w-60'>
                        <Calendar className="size-5 text-zinc-400" />
                        <span className="bg-transparent text-lg text-zinc-400 w-40 flex-1 text-left">
                            {displayedDate || "Qual a nova data?"}
                        </span>
                    </button>
                    {isDatePickerOpen && (
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                            <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">Selecione a nova data!</h2>
                                        <button type="button" onClick={closeDatePicker} >
                                            <X className="size-5 text-zinc-400" />
                                        </button>
                                    </div>
                                </div>
                                <DayPicker mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates} />
                            </div>
                        </div>
                    )}
                    < Button variant="primary" size="full">
                        Alterar Local e data
                        <Plus className="size-5" />
                    </Button>

                </form>
            </div>
        </div >
    )
}