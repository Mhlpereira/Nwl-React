import { MapPin, Calendar, ArrowRight, Settings2, X } from "lucide-react";
import { Button } from "../../../components/button";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import {format} from "date-fns"
import "react-day-picker/dist/style.css";

interface DestinationAndDateStepProps {
    isGuestsInputOpen: boolean
    eventStartAndEndDates: DateRange | undefined
    closeGuestInput: () => void
    openGuestInput: () => void
    setDestination: (destination : string) => void
    setEventStartAndEndDates: (dates: DateRange | undefined) => void
}


export function DestinationAndDateStep({
    closeGuestInput,
    openGuestInput,
    isGuestsInputOpen,
    setDestination,
    setEventStartAndEndDates,
    eventStartAndEndDates
}: DestinationAndDateStepProps) {
    const [isDatePickerOpen, setDatePickerOpen] = useState(false)

    

    function openDatePicker() {
        return setDatePickerOpen(true)
    }

    function closeDatePicker() {
        return setDatePickerOpen(false)
    }

    const displayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to
    ? format(eventStartAndEndDates.from, "d ' de ' LLL").concat( ' até ').concat(format(eventStartAndEndDates.to, "d ' de ' LLL")) : null

    return (
        <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">

            <div className='flex items-center gap-2 flex-1'>
                <MapPin className="size-5 text-zinc-400" />
                <input disabled={isGuestsInputOpen} type="text" placeholder="Para onde você vai?" 
                className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
                onChange={event => setDestination(event.target.value)}
                />
            </div>


            <button onClick={openDatePicker} disabled={isGuestsInputOpen} className='flex items-center gap-2 w-60'>
                <Calendar className="size-5 text-zinc-400" />
                <span className="bg-transparent text-lg text-zinc-400 w-40 flex-1 text-left">
                    {displayedDate || "Quando?"}
                </span>
            </button>
            {isDatePickerOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Selecione a data</h2>
                                <button type="button" onClick={closeDatePicker} >
                                    <X className="size-5 text-zinc-400" />
                                </button>
                            </div>
                        </div>
                        <DayPicker mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates}/>
                    </div>
                </div>
            )}

            <div className="w-px h-6 bg-zinc-800" />

            {/* utilizando o botão para ativar a função */}
            {isGuestsInputOpen ? (
                <Button onClick={closeGuestInput} variant="secundary">
                    Alterar local/data
                    <Settings2 className="size-5" />
                </Button>
            ) : (
                <Button onClick={openGuestInput} variant="primary">
                    Continuar
                    <ArrowRight className="size-5" />
                </Button>
            )}

        </div>

    )

}