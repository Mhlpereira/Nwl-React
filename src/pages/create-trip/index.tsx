import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestModal } from './invite-guest-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestStep } from './steps/invite-guest-step'
import { DateRange } from 'react-day-picker'
import { api } from '../../lib/axios'

export function CreateTripPage() {

  const navigate = useNavigate()


  {/*Variável para alternar o estaro */ }
  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestModalOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setTripModalOpen] = useState(false)

  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()


  const [ emailsToInvite, setEmailsToInvite] = useState([
    'mario@mario.rio'
  ])


  {/* função utilizada para alternar o estado*/ }
  function openGuestInput() {
    setIsGuestsInputOpen(true)
  }

  function closeGuestInput() {
    setIsGuestsInputOpen(false)
  }


  {/* função para criação do modal*/ }
  function openGuestModal() {
    setIsGuestsModalOpen(true)
  }

  function closeGuestModal() {
    setIsGuestsModalOpen(false)
  }

  {/* função para criação do modal de confirmação de viagem*/ }
  function openConfirmTripModal() {
    setTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setTripModalOpen(false)
  }

  {/*função para adicionar emails*/ }
  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    setEmailsToInvite([
      ...emailsToInvite,
      email
    ])

    event.currentTarget.reset()
  }

  {/*remover email do array*/ }
  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)

    setEmailsToInvite(newEmailList)
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if(!destination){
      return
    }

    if(!eventStartAndEndDates?.from || !eventStartAndEndDates.to) {
      return
    }

    if(emailsToInvite.length == 0){
      return
    }

    if(!ownerName || !ownerEmail){
      return
    }

    const response = await api.post('/trips', {
      destination: destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to ,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail,
    })

    const {tripId} = response.data

    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">

        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="planner" />
          <p className="text-zinc-500 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>


        <div className='space-y-4'>

          <DestinationAndDateStep
            closeGuestInput={closeGuestInput}
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestInput={openGuestInput}
            setDestination={setDestination}
            eventStartAndEndDates={eventStartAndEndDates}
            setEventStartAndEndDates={setEventStartAndEndDates}
          />


          {/* adicionando outro input qnd alternado o estado */}
          {isGuestsInputOpen && (
            <InviteGuestStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestModal={openGuestModal}
            />
          )}

        </div>

        <p>Ao planejar sua viagem pela plann.er você automaticamente concorda<br />
          com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.</p>
      </div>


      {/*criação do modal*/}
      {isGuestModalOpen && (
        <InviteGuestModal
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestModal={closeGuestModal}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}

      {/*criação do modal de confirmação de viagem*/}
      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
        />
      )}


    </div>
  )
}
