import { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabaseClient";
import logoIcon from './assets/logo-icon.png';

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg:"#080808", surface:"#101010", card:"#161616", border:"#222", muted:"#2a2a2a",
  silver:"#666", mid:"#999", light:"#ddd", white:"#f3f3f3",
  gold:"#b8955a", goldLo:"rgba(184,149,90,0.12)", goldMid:"rgba(184,149,90,0.25)",
  red:"#9e4040", redLo:"rgba(158,64,64,0.12)",
  green:"#4a8a5f", greenLo:"rgba(74,138,95,0.12)",
  blue:"#4a6a9e", blueLo:"rgba(74,106,158,0.12)",
};

const GS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Josefin+Sans:wght@300;400;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{background:${T.bg};min-height:100%;width:100%;}
  body{background:${T.bg};}
  ::-webkit-scrollbar{width:3px;height:3px;}
  ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px;}
  input,select,textarea,button{font-family:inherit;}
  input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.4);}
  .tap:active{opacity:0.7;}
  .slot-h:hover{border-color:${T.gold}!important;color:${T.gold}!important;}
  .row-h:hover{background:rgba(255,255,255,0.02)!important;}
  @media print{body{background:white!important;color:black!important;}.no-print{display:none!important;}}
`;

// ─── LANGUAGES ───────────────────────────────────────────────────────────────
const LANGS = {
  pt:{ flag:"🇵🇹", name:"Português",
    months:["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
    wdays:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
    wdaysF:["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],
    pay:["Dinheiro","MB Way","Multibanco","Transferência","Outro"],
    t:{
      client:"Sou Cliente", bookCta:"Marcar Corte", clientSub:"Marcar corte, ver marcações", myBookingsLabel:"Ver as minhas marcações", phonePlaceholder:"O teu telemóvel", ourTeam:"A nossa equipa", barberLabel:"Barbeiro", priceLabel:"Valor", nameLabel:"Nome", namePlaceholder:"O teu nome", noBookingsFound:"Sem marcações encontradas",
      barber:"Sou Barbeiro / Admin", barberSub:"Gerir agenda e marcações",
      platform:"A tua plataforma de barbearia",
      accessCode:"Código de Acesso", enter:"Entrar", wrongPin:"Código incorreto",
      hide:"Ocultar", show:"Ver",
      barberArea:"Área do Barbeiro", clientArea:"Área do Cliente",
      today:"Hoje", tomorrow:"Amanhã", yesterday:"Ontem",
      bookings:"marcações", concluded:"concluídas", toConfirm:"Confirmar",
      week:"Semana", revenue:"Receita Hoje", pendingRev:"por receber",
      nextBookings:"Próximas marcações", noFuture:"Sem marcações futuras",
      agenda:"Agenda", dashboard:"Início", notifications:"Alertas",
      clients:"Clientes", reports:"Receita", schedule:"Horário", profile:"Perfil",
      newBooking:"+ Novo", block:"🔒 Bloquear", addBooking:"Nova Marcação",
      editBooking:"Editar Marcação", save:"Guardar", delete:"Eliminar", close:"Fechar",
      clientName:"Nome do Cliente", fullName:"Nome completo", phone:"Telemóvel",
      date:"Data", time:"Hora", service:"Serviço", payment:"Pago", payMethod:"— método —",
      notes:"Notas", observations:"Observações…", back:"← Voltar", next:"Continuar →",
      confirmed:"Confirmado", done:"Concluído", cancelled:"Cancelado", blocked:"Bloqueado", selected:"Selecionado",
      freeSlots:"Horários livres", dayBlocked:"Dia inteiro bloqueado", unblock:"Desbloquear",
      blockSlot:"Horário", blockDay:"Dia inteiro", blockPeriod:"Período", blockHours:"Ausência",
      blockSlotTitle:"Escolhe o horário a bloquear", blockDayTitle:"Bloquear dia inteiro",blockHoursTitle:"Bloquear horas de ausência",
      blockPeriodTitle:"Bloquear período (ex: férias)", blockDays:"dias bloqueados",
      noBookings:"Sem marcações — toque em + Novo", holiday:"Folga neste dia",
      searchClient:"Pesquisar nome ou telemóvel…", visits:"visita", totalSpent:"gasto total",
      barberNotes:"Notas do barbeiro", noNotes:"Sem notas — clique em Editar para adicionar",
      edit:"Editar", cancel:"Cancelar", upcoming:"Próximas marcações", history:"Histórico de visitas",
      noHistory:"Sem histórico", favorite:"Favorito",
      confirmedRev:"✓ Receita Confirmada", pendingPayment:"⚠ Por Receber", scheduled:"Agendado",
      payConfirm:"Confirmar Pagamento", confirmReceipt:"✓ Confirmar Recebimento de",
      printToday:"🖨 Relatório Hoje", printMonth:"🖨 Relatório Mês",
      byMethod:"Por método de pagamento", byService:"Por serviço", last7:"Receita confirmada — 7 dias",
      records:"Registos", total:"total", services:"Serviços",
      workDays:"Dias de trabalho", startHour:"Início", endHour:"Fim", generatedSlots:"Horários gerados",
      saveSchedule:"Guardar Horário", barbershop:"Barbearia", barberName:"Nome do Barbeiro",
      address:"Morada", bio:"Bio", newPin:"Novo PIN", keepPin:"Deixar vazio para manter",
      logout:"Sair", chooseBarber:"1. Escolha o barbeiro", chooseService:"2. Escolha o serviço",
      chooseDate:"3. Escolha a data", yourData:"4. Os teus dados", confirm:"Confirmar Marcação",
      bookingConfirmed:"Confirmado!", newBookingBtn:"Nova Marcação", myBookings:"Ver Marcações",
      myBookingsTitle:"As minhas marcações", cancelBooking:"Cancelar",
      trialDays:"d trial", active:"✓ ATIVO", subscribeTitle:"Escolhe o teu plano",
      subscribeSubtitle:"Sem compromisso. Cancela quando quiseres.",
      trialStatus:"Estado do Trial", daysLeft:"dias restantes", trialExpired:"Trial expirado",
      solo:"Solo", team:"Equipa", subscribeNow:"Subscrever Agora",
      expiredTitle:"Trial expirado", expiredSub:"Os teus dados estão guardados.\nSubscreve para continuar.",
      seePlans:"Ver Planos a partir de €9,99/mês", readMore:"Saber mais",
      markAllRead:"Marcar lidas", clearAllBtn:"Limpar", noNotifications:"Sem notificações",
      pendingOpen:"em aberto",
      clientWord:"cliente", bookedBadge:"MARCADO", lastVisitLabel:"Última",
      notePlaceholder:"Notas sobre o cliente (preferências, alergias, etc.)…", saveNoteBtn:"Guardar Nota",
      statVisitsLabel:"Visitas", statSpentLabel:"Gasto",
      noBookingCanBeMade:"Nenhum cliente poderá marcar neste dia.", fromDate:"De", toDate:"Até",
      noBookingsShort:"Sem marcações", blockedSlotLabel:"Horário bloqueado",
      all:"Tudo", servicesUnconfirmed:"sem pagamento confirmado", paidConfirmedCount:"pagos e confirmados",
      unconfirmedCount:"sem confirmação", scheduledLabel:"Agendado", futureCount:"futuras",
      paidAndConfirmed:"Pagos e Confirmados", serviceDonePaymentPending:"Serviço Feito — Pagamento Por Confirmar",
      scheduledCount:"Agendados", noRecordsPeriod:"Sem registos para este período",
      role:"Função",
      paymentMethod:"Método de Pagamento", confirmAmountBtn:"✓ Confirmar",
      reportLabel:"Relatório", issuedOn:"Emitido em", billed:"Faturado", paidServices:"Serviços Pagos",
      unconfirmedPayment:"Sem Pagamento Confirmado", printBtn:"Imprimir",
    }
  },
  en:{ flag:"🇬🇧", name:"English",
    months:["January","February","March","April","May","June","July","August","September","October","November","December"],
    wdays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    wdaysF:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    pay:["Cash","MB Way","Debit Card","Transfer","Other"],
    t:{
      client:"I'm a Client", bookCta:"Book Appointment", clientSub:"Book a haircut, see appointments", myBookingsLabel:"View My Bookings", phonePlaceholder:"Your phone number", ourTeam:"Our Team", barberLabel:"Barber", priceLabel:"Price", nameLabel:"Name", namePlaceholder:"Your name", noBookingsFound:"No bookings found",
      barber:"I'm a Barber / Admin", barberSub:"Manage schedule and bookings",
      platform:"Your barbershop platform",
      accessCode:"Access Code", enter:"Enter", wrongPin:"Incorrect code",
      hide:"Hide", show:"Show",
      barberArea:"Barber Area", clientArea:"Client Area",
      today:"Today", tomorrow:"Tomorrow", yesterday:"Yesterday",
      bookings:"bookings", concluded:"completed", toConfirm:"Confirm",
      week:"Week", revenue:"Today's Revenue", pendingRev:"pending",
      nextBookings:"Upcoming bookings", noFuture:"No upcoming bookings",
      agenda:"Agenda", dashboard:"Home", notifications:"Alerts",
      clients:"Clients", reports:"Revenue", schedule:"Schedule", profile:"Profile",
      newBooking:"+ New", block:"🔒 Block", addBooking:"New Booking",
      editBooking:"Edit Booking", save:"Save", delete:"Delete", close:"Close",
      clientName:"Client Name", fullName:"Full name", phone:"Phone",
      date:"Date", time:"Time", service:"Service", payment:"Paid", payMethod:"— method —",
      notes:"Notes", observations:"Observations…", back:"← Back", next:"Continue →",
      confirmed:"Confirmed", done:"Completed", cancelled:"Cancelled", blocked:"Blocked", selected:"Selected",
      freeSlots:"Available slots", dayBlocked:"Full day blocked", unblock:"Unblock",
      blockSlot:"Time slot", blockDay:"Full day", blockPeriod:"Period",
      blockSlotTitle:"Choose slot to block", blockDayTitle:"Block full day",
      blockPeriodTitle:"Block period (e.g. holidays)", blockDays:"days blocked",
      noBookings:"No bookings — tap + New to add", holiday:"Day off",
      searchClient:"Search name or phone…", visits:"visit", totalSpent:"total spent",
      barberNotes:"Barber notes", noNotes:"No notes — click Edit to add",
      edit:"Edit", cancel:"Cancel", upcoming:"Upcoming bookings", history:"Visit history",
      noHistory:"No history", favorite:"Favourite",
      confirmedRev:"✓ Confirmed Revenue", pendingPayment:"⚠ Pending Payment", scheduled:"Scheduled",
      payConfirm:"Confirm Payment", confirmReceipt:"✓ Confirm Receipt of",
      printToday:"🖨 Today's Report", printMonth:"🖨 Monthly Report",
      byMethod:"By payment method", byService:"By service", last7:"Confirmed revenue — 7 days",
      records:"Records", total:"total", services:"Services",
      workDays:"Work days", startHour:"Start", endHour:"End", generatedSlots:"Generated slots",
      saveSchedule:"Save Schedule", barbershop:"Barbershop", barberName:"Barber Name",
      address:"Address", bio:"Bio", newPin:"New PIN", keepPin:"Leave empty to keep current",
      logout:"Sign out", chooseBarber:"1. Choose barber", chooseService:"2. Choose service",
      chooseDate:"3. Choose date", yourData:"4. Your details", confirm:"Confirm Booking",
      bookingConfirmed:"Confirmed!", newBookingBtn:"New Booking", myBookings:"My Bookings",
      myBookingsTitle:"My bookings", cancelBooking:"Cancel",
      trialDays:"d trial", active:"✓ ACTIVE", subscribeTitle:"Choose your plan",
      subscribeSubtitle:"No commitment. Cancel anytime.",
      trialStatus:"Trial Status", daysLeft:"days remaining", trialExpired:"Trial expired",
      solo:"Solo", team:"Team", subscribeNow:"Subscribe Now",
      expiredTitle:"Trial expired", expiredSub:"Your data is saved.\nSubscribe to continue.",
      seePlans:"See Plans from €9.99/month", readMore:"Learn more",
      markAllRead:"Mark read", clearAllBtn:"Clear", noNotifications:"No notifications",
      pendingOpen:"pending",
      clientWord:"client", bookedBadge:"BOOKED", lastVisitLabel:"Last",
      notePlaceholder:"Notes about the client (preferences, allergies, etc.)…", saveNoteBtn:"Save Note",
      statVisitsLabel:"Visits", statSpentLabel:"Spent",
      noBookingCanBeMade:"No client will be able to book on this day.", fromDate:"From", toDate:"To",
      noBookingsShort:"No bookings", blockedSlotLabel:"Blocked time slot",
      all:"All", servicesUnconfirmed:"unconfirmed payment", paidConfirmedCount:"paid and confirmed",
      unconfirmedCount:"unconfirmed", scheduledLabel:"Scheduled", futureCount:"upcoming",
      paidAndConfirmed:"Paid and Confirmed", serviceDonePaymentPending:"Service Done — Payment Pending",
      scheduledCount:"Scheduled", noRecordsPeriod:"No records for this period",
      role:"Role",
      paymentMethod:"Payment Method", confirmAmountBtn:"✓ Confirm",
      reportLabel:"Report", issuedOn:"Issued on", billed:"Billed", paidServices:"Paid Services",
      unconfirmedPayment:"Unconfirmed Payment", printBtn:"Print",
    }
  },
  es:{ flag:"🇪🇸", name:"Español",
    months:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    wdays:["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
    wdaysF:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
    pay:["Efectivo","MB Way","Tarjeta","Transferencia","Otro"],
    t:{
      client:"Soy Cliente", bookCta:"Reservar Cita", clientSub:"Reservar corte, ver citas", myBookingsLabel:"Ver Mis Citas", phonePlaceholder:"Su teléfono", ourTeam:"Nuestro Equipo", barberLabel:"Barbero", priceLabel:"Precio", nameLabel:"Nombre", namePlaceholder:"Su nombre", noBookingsFound:"No se encontraron citas",
      barber:"Soy Barbero / Admin", barberSub:"Gestionar agenda y reservas",
      platform:"Tu plataforma de barbería",
      accessCode:"Código de Acceso", enter:"Entrar", wrongPin:"Código incorrecto",
      hide:"Ocultar", show:"Ver",
      barberArea:"Área del Barbero", clientArea:"Área del Cliente",
      today:"Hoy", tomorrow:"Mañana", yesterday:"Ayer",
      bookings:"citas", concluded:"completadas", toConfirm:"Confirmar",
      week:"Semana", revenue:"Ingresos Hoy", pendingRev:"pendiente",
      nextBookings:"Próximas citas", noFuture:"Sin citas futuras",
      agenda:"Agenda", dashboard:"Inicio", notifications:"Alertas",
      clients:"Clientes", reports:"Ingresos", schedule:"Horario", profile:"Perfil",
      newBooking:"+ Nuevo", block:"🔒 Bloquear", addBooking:"Nueva Cita",
      editBooking:"Editar Cita", save:"Guardar", delete:"Eliminar", close:"Cerrar",
      clientName:"Nombre del Cliente", fullName:"Nombre completo", phone:"Teléfono",
      date:"Fecha", time:"Hora", service:"Servicio", payment:"Pagado", payMethod:"— método —",
      notes:"Notas", observations:"Observaciones…", back:"← Volver", next:"Continuar →",
      confirmed:"Confirmado", done:"Completado", cancelled:"Cancelado", blocked:"Bloqueado", selected:"Seleccionado",
      freeSlots:"Horarios libres", dayBlocked:"Día completo bloqueado", unblock:"Desbloquear",
      blockSlot:"Horario", blockDay:"Día completo", blockPeriod:"Período",
      blockSlotTitle:"Elige el horario a bloquear", blockDayTitle:"Bloquear día completo",
      blockPeriodTitle:"Bloquear período (ej. vacaciones)", blockDays:"días bloqueados",
      noBookings:"Sin citas — toca + Nuevo", holiday:"Día libre",
      searchClient:"Buscar nombre o teléfono…", visits:"visita", totalSpent:"total gastado",
      barberNotes:"Notas del barbero", noNotes:"Sin notas — haz clic en Editar",
      edit:"Editar", cancel:"Cancelar", upcoming:"Próximas citas", history:"Historial de visitas",
      noHistory:"Sin historial", favorite:"Favorito",
      confirmedRev:"✓ Ingresos Confirmados", pendingPayment:"⚠ Por Cobrar", scheduled:"Programado",
      payConfirm:"Confirmar Pago", confirmReceipt:"✓ Confirmar Cobro de",
      printToday:"🖨 Informe Hoy", printMonth:"🖨 Informe Mes",
      byMethod:"Por método de pago", byService:"Por servicio", last7:"Ingresos confirmados — 7 días",
      records:"Registros", total:"total", services:"Servicios",
      workDays:"Días de trabajo", startHour:"Inicio", endHour:"Fin", generatedSlots:"Horarios generados",
      saveSchedule:"Guardar Horario", barbershop:"Barbería", barberName:"Nombre del Barbero",
      address:"Dirección", bio:"Bio", newPin:"Nuevo PIN", keepPin:"Dejar vacío para mantener",
      logout:"Salir", chooseBarber:"1. Elige el barbero", chooseService:"2. Elige el servicio",
      chooseDate:"3. Elige la fecha", yourData:"4. Tus datos", confirm:"Confirmar Reserva",
      bookingConfirmed:"¡Confirmado!", newBookingBtn:"Nueva Reserva", myBookings:"Mis Reservas",
      myBookingsTitle:"Mis reservas", cancelBooking:"Cancelar",
      trialDays:"d prueba", active:"✓ ACTIVO", subscribeTitle:"Elige tu plan",
      subscribeSubtitle:"Sin compromiso. Cancela cuando quieras.",
      trialStatus:"Estado de Prueba", daysLeft:"días restantes", trialExpired:"Prueba expirada",
      solo:"Solo", team:"Equipo", subscribeNow:"Suscribirse Ahora",
      expiredTitle:"Prueba expirada", expiredSub:"Tus datos están guardados.\nSuscríbete para continuar.",
      seePlans:"Ver Planes desde €9,99/mes", readMore:"Saber más",
      markAllRead:"Marcar leídas", clearAllBtn:"Borrar", noNotifications:"Sin notificaciones",
      pendingOpen:"pendiente",
      clientWord:"cliente", bookedBadge:"RESERVADO", lastVisitLabel:"Última",
      notePlaceholder:"Notas sobre el cliente (preferencias, alergias, etc.)…", saveNoteBtn:"Guardar Nota",
      statVisitsLabel:"Visitas", statSpentLabel:"Gastado",
      noBookingCanBeMade:"Ningún cliente podrá reservar este día.", fromDate:"Desde", toDate:"Hasta",
      noBookingsShort:"Sin reservas", blockedSlotLabel:"Horario bloqueado",
      all:"Todo", servicesUnconfirmed:"sin pago confirmado", paidConfirmedCount:"pagados y confirmados",
      unconfirmedCount:"sin confirmar", scheduledLabel:"Programado", futureCount:"futuras",
      paidAndConfirmed:"Pagados y Confirmados", serviceDonePaymentPending:"Servicio Hecho — Pago Pendiente",
      scheduledCount:"Programados", noRecordsPeriod:"Sin registros para este período",
      role:"Función",
      paymentMethod:"Método de Pago", confirmAmountBtn:"✓ Confirmar",
      reportLabel:"Informe", issuedOn:"Emitido el", billed:"Facturado", paidServices:"Servicios Pagados",
      unconfirmedPayment:"Pago No Confirmado", printBtn:"Imprimir",
    }
  },
  fr:{ flag:"🇫🇷", name:"Français",
    months:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
    wdays:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],
    wdaysF:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],
    pay:["Espèces","MB Way","Carte","Virement","Autre"],
    t:{
      client:"Je suis Client", bookCta:"Prendre RDV", clientSub:"Réserver une coupe, voir mes rendez-vous", myBookingsLabel:"Voir Mes Rendez-vous", phonePlaceholder:"Votre téléphone", ourTeam:"Notre Équipe", barberLabel:"Coiffeur", priceLabel:"Prix", nameLabel:"Nom", namePlaceholder:"Votre nom", noBookingsFound:"Aucun rendez-vous trouvé",
      barber:"Je suis Barbier / Admin", barberSub:"Gérer l'agenda et les réservations",
      platform:"Votre plateforme de barbier",
      accessCode:"Code d'Accès", enter:"Entrer", wrongPin:"Code incorrect",
      hide:"Masquer", show:"Voir",
      barberArea:"Espace Barbier", clientArea:"Espace Client",
      today:"Aujourd'hui", tomorrow:"Demain", yesterday:"Hier",
      bookings:"rendez-vous", concluded:"terminés", toConfirm:"Confirmer",
      week:"Semaine", revenue:"Revenus Aujourd'hui", pendingRev:"en attente",
      nextBookings:"Prochains rendez-vous", noFuture:"Aucun rendez-vous à venir",
      agenda:"Agenda", dashboard:"Accueil", notifications:"Alertes",
      clients:"Clients", reports:"Revenus", schedule:"Horaires", profile:"Profil",
      newBooking:"+ Nouveau", block:"🔒 Bloquer", addBooking:"Nouveau Rendez-vous",
      editBooking:"Modifier Rendez-vous", save:"Enregistrer", delete:"Supprimer", close:"Fermer",
      clientName:"Nom du Client", fullName:"Nom complet", phone:"Téléphone",
      date:"Date", time:"Heure", service:"Service", payment:"Payé", payMethod:"— méthode —",
      notes:"Notes", observations:"Observations…", back:"← Retour", next:"Continuer →",
      confirmed:"Confirmé", done:"Terminé", cancelled:"Annulé", blocked:"Bloqué", selected:"Sélectionné",
      freeSlots:"Créneaux disponibles", dayBlocked:"Journée entière bloquée", unblock:"Débloquer",
      blockSlot:"Créneau", blockDay:"Journée entière", blockPeriod:"Période",
      blockSlotTitle:"Choisir le créneau à bloquer", blockDayTitle:"Bloquer la journée entière",
      blockPeriodTitle:"Bloquer une période (ex. vacances)", blockDays:"jours bloqués",
      noBookings:"Aucun rendez-vous — appuyer sur + Nouveau", holiday:"Jour de repos",
      searchClient:"Rechercher nom ou téléphone…", visits:"visite", totalSpent:"total dépensé",
      barberNotes:"Notes du barbier", noNotes:"Aucune note — cliquer sur Modifier",
      edit:"Modifier", cancel:"Annuler", upcoming:"Prochains rendez-vous", history:"Historique des visites",
      noHistory:"Aucun historique", favorite:"Favori",
      confirmedRev:"✓ Revenus Confirmés", pendingPayment:"⚠ À Encaisser", scheduled:"Planifié",
      payConfirm:"Confirmer le Paiement", confirmReceipt:"✓ Confirmer l'encaissement de",
      printToday:"🖨 Rapport Aujourd'hui", printMonth:"🖨 Rapport Mensuel",
      byMethod:"Par méthode de paiement", byService:"Par service", last7:"Revenus confirmés — 7 jours",
      records:"Registres", total:"total", services:"Services",
      workDays:"Jours de travail", startHour:"Début", endHour:"Fin", generatedSlots:"Créneaux générés",
      saveSchedule:"Enregistrer les Horaires", barbershop:"Salon de coiffure", barberName:"Nom du Barbier",
      address:"Adresse", bio:"Bio", newPin:"Nouveau PIN", keepPin:"Laisser vide pour conserver",
      logout:"Déconnexion", chooseBarber:"1. Choisir le barbier", chooseService:"2. Choisir le service",
      chooseDate:"3. Choisir la date", yourData:"4. Vos coordonnées", confirm:"Confirmer la Réservation",
      bookingConfirmed:"Confirmé!", newBookingBtn:"Nouvelle Réservation", myBookings:"Mes Réservations",
      myBookingsTitle:"Mes réservations", cancelBooking:"Annuler",
      trialDays:"j essai", active:"✓ ACTIF", subscribeTitle:"Choisissez votre plan",
      subscribeSubtitle:"Sans engagement. Annulez quand vous voulez.",
      trialStatus:"Statut d'Essai", daysLeft:"jours restants", trialExpired:"Essai expiré",
      solo:"Solo", team:"Équipe", subscribeNow:"S'abonner Maintenant",
      expiredTitle:"Essai expiré", expiredSub:"Vos données sont sauvegardées.\nAbonnez-vous pour continuer.",
      seePlans:"Voir les Plans à partir de 9,99€/mois", readMore:"En savoir plus",
      markAllRead:"Marquer comme lu", clearAllBtn:"Effacer", noNotifications:"Aucune notification",
      pendingOpen:"en attente",
      clientWord:"client", bookedBadge:"RÉSERVÉ", lastVisitLabel:"Dernière",
      notePlaceholder:"Notes sur le client (préférences, allergies, etc.)…", saveNoteBtn:"Enregistrer la Note",
      statVisitsLabel:"Visites", statSpentLabel:"Dépensé",
      noBookingCanBeMade:"Aucun client ne pourra réserver ce jour.", fromDate:"Du", toDate:"Au",
      noBookingsShort:"Aucune réservation", blockedSlotLabel:"Créneau bloqué",
      all:"Tout", servicesUnconfirmed:"paiement non confirmé", paidConfirmedCount:"payés et confirmés",
      unconfirmedCount:"non confirmé", scheduledLabel:"Programmé", futureCount:"à venir",
      paidAndConfirmed:"Payés et Confirmés", serviceDonePaymentPending:"Service Effectué — Paiement en Attente",
      scheduledCount:"Programmés", noRecordsPeriod:"Aucun enregistrement pour cette période",
      role:"Fonction",
      paymentMethod:"Mode de Paiement", confirmAmountBtn:"✓ Confirmer",
      reportLabel:"Rapport", issuedOn:"Émis le", billed:"Facturé", paidServices:"Services Payés",
      unconfirmedPayment:"Paiement Non Confirmé", printBtn:"Imprimer",
    }
  },
  de:{ flag:"🇩🇪", name:"Deutsch",
    months:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
    wdays:["So","Mo","Di","Mi","Do","Fr","Sa"],
    wdaysF:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
    pay:["Bargeld","MB Way","Karte","Überweisung","Sonstiges"],
    t:{
      client:"Ich bin Kunde", bookCta:"Termin buchen", clientSub:"Haarschnitt buchen, Termine sehen", myBookingsLabel:"Meine Termine ansehen", phonePlaceholder:"Ihre Telefonnummer", ourTeam:"Unser Team", barberLabel:"Friseur", priceLabel:"Preis", nameLabel:"Name", namePlaceholder:"Ihr Name", noBookingsFound:"Keine Termine gefunden",
      barber:"Ich bin Friseur / Admin", barberSub:"Termine und Kalender verwalten",
      platform:"Ihre Barbershop-Plattform",
      accessCode:"Zugangscode", enter:"Einloggen", wrongPin:"Falscher Code",
      hide:"Verbergen", show:"Anzeigen",
      barberArea:"Friseurbereich", clientArea:"Kundenbereich",
      today:"Heute", tomorrow:"Morgen", yesterday:"Gestern",
      bookings:"Termine", concluded:"abgeschlossen", toConfirm:"Bestätigen",
      week:"Woche", revenue:"Heutiger Umsatz", pendingRev:"ausstehend",
      nextBookings:"Nächste Termine", noFuture:"Keine bevorstehenden Termine",
      agenda:"Kalender", dashboard:"Startseite", notifications:"Benachrichtigungen",
      clients:"Kunden", reports:"Umsatz", schedule:"Arbeitszeiten", profile:"Profil",
      newBooking:"+ Neu", block:"🔒 Sperren", addBooking:"Neuer Termin",
      editBooking:"Termin bearbeiten", save:"Speichern", delete:"Löschen", close:"Schließen",
      clientName:"Kundenname", fullName:"Vollständiger Name", phone:"Telefon",
      date:"Datum", time:"Uhrzeit", service:"Leistung", payment:"Bezahlt", payMethod:"— Methode —",
      notes:"Notizen", observations:"Anmerkungen…", back:"← Zurück", next:"Weiter →",
      confirmed:"Bestätigt", done:"Abgeschlossen", cancelled:"Storniert", blocked:"Gesperrt", selected:"Ausgewählt",
      freeSlots:"Freie Slots", dayBlocked:"Ganzer Tag gesperrt", unblock:"Entsperren",
      blockSlot:"Zeitslot", blockDay:"Ganzer Tag", blockPeriod:"Zeitraum",
      blockSlotTitle:"Zeitslot zum Sperren wählen", blockDayTitle:"Ganzen Tag sperren",
      blockPeriodTitle:"Zeitraum sperren (z.B. Urlaub)", blockDays:"Tage gesperrt",
      noBookings:"Keine Termine — + Neu tippen", holiday:"Freier Tag",
      searchClient:"Name oder Telefon suchen…", visits:"Besuch", totalSpent:"gesamt ausgegeben",
      barberNotes:"Friseur-Notizen", noNotes:"Keine Notizen — auf Bearbeiten klicken",
      edit:"Bearbeiten", cancel:"Abbrechen", upcoming:"Bevorstehende Termine", history:"Besuchshistorie",
      noHistory:"Keine Historie", favorite:"Favorit",
      confirmedRev:"✓ Bestätigter Umsatz", pendingPayment:"⚠ Ausstehend", scheduled:"Geplant",
      payConfirm:"Zahlung bestätigen", confirmReceipt:"✓ Eingang bestätigen von",
      printToday:"🖨 Tagesbericht", printMonth:"🖨 Monatsbericht",
      byMethod:"Nach Zahlungsmethode", byService:"Nach Leistung", last7:"Bestätigter Umsatz — 7 Tage",
      records:"Aufzeichnungen", total:"gesamt", services:"Leistungen",
      workDays:"Arbeitstage", startHour:"Beginn", endHour:"Ende", generatedSlots:"Generierte Slots",
      saveSchedule:"Arbeitszeiten speichern", barbershop:"Friseursalon", barberName:"Friseurname",
      address:"Adresse", bio:"Bio", newPin:"Neuer PIN", keepPin:"Leer lassen zum Beibehalten",
      logout:"Abmelden", chooseBarber:"1. Friseur wählen", chooseService:"2. Leistung wählen",
      chooseDate:"3. Datum wählen", yourData:"4. Ihre Daten", confirm:"Buchung bestätigen",
      bookingConfirmed:"Bestätigt!", newBookingBtn:"Neue Buchung", myBookings:"Meine Buchungen",
      myBookingsTitle:"Meine Buchungen", cancelBooking:"Stornieren",
      trialDays:"T Testphase", active:"✓ AKTIV", subscribeTitle:"Plan wählen",
      subscribeSubtitle:"Keine Bindung. Jederzeit kündbar.",
      trialStatus:"Teststatus", daysLeft:"Tage verbleibend", trialExpired:"Testphase abgelaufen",
      solo:"Solo", team:"Team", subscribeNow:"Jetzt abonnieren",
      expiredTitle:"Testphase abgelaufen", expiredSub:"Ihre Daten sind gespeichert.\nAbonnieren Sie, um fortzufahren.",
      seePlans:"Pläne ab 9,99€/Monat", readMore:"Mehr erfahren",
      markAllRead:"Als gelesen markieren", clearAllBtn:"Löschen", noNotifications:"Keine Benachrichtigungen",
      pendingOpen:"ausstehend",
      clientWord:"Kunde", bookedBadge:"GEBUCHT", lastVisitLabel:"Letzter",
      notePlaceholder:"Notizen zum Kunden (Vorlieben, Allergien usw.)…", saveNoteBtn:"Notiz Speichern",
      statVisitsLabel:"Besuche", statSpentLabel:"Ausgegeben",
      noBookingCanBeMade:"An diesem Tag kann kein Kunde buchen.", fromDate:"Von", toDate:"Bis",
      noBookingsShort:"Keine Termine", blockedSlotLabel:"Blockierter Termin",
      all:"Alle", servicesUnconfirmed:"unbestätigte Zahlung", paidConfirmedCount:"bezahlt und bestätigt",
      unconfirmedCount:"unbestätigt", scheduledLabel:"Geplant", futureCount:"bevorstehend",
      paidAndConfirmed:"Bezahlt und Bestätigt", serviceDonePaymentPending:"Service Erledigt — Zahlung Ausstehend",
      scheduledCount:"Geplant", noRecordsPeriod:"Keine Einträge für diesen Zeitraum",
      role:"Funktion",
      paymentMethod:"Zahlungsmethode", confirmAmountBtn:"✓ Bestätigen",
      reportLabel:"Bericht", issuedOn:"Ausgestellt am", billed:"Abgerechnet", paidServices:"Bezahlte Leistungen",
      unconfirmedPayment:"Unbestätigte Zahlung", printBtn:"Drucken",
    }
  },
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const ALL_HOURS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00",
                   "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00"];
const MONTHS  = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WDAYS   = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const WDAYS_F = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const PAY     = ["Dinheiro","MB Way","Multibanco","Transferência","Outro"];

const mkId  = () => Math.random().toString(36).slice(2,9);
const fmt   = d  => d.toISOString().split("T")[0];
const TODAY = fmt(new Date());
const NOW   = new Date();

function dateLabel(str,lang='pt') {
  const d=new Date(str+"T12:00:00"), diff=Math.round((d-new Date(TODAY+"T12:00:00"))/86400000);
  const L=LANGS[lang].t;
  if(diff===0)return L.today; if(diff===1)return L.tomorrow; if(diff===-1)return L.yesterday;
  return `${d.getDate()} ${LANGS[lang].months[d.getMonth()].slice(0,3)}`;
}
function timeAgo(ts) {
  const diff=Math.round((Date.now()-ts)/60000);
  if(diff<1)return"agora"; if(diff<60)return`${diff}m`; if(diff<1440)return`${Math.round(diff/60)}h`;
  return`${Math.round(diff/1440)}d`;
}

// ─── SEED ────────────────────────────────────────────────────────────────────
const INIT_SERVICES = [
  {id:"s1",name:"Corte Clássico",    duration:30,price:15,active:true,
    names:{pt:"Corte Clássico",en:"Classic Cut",es:"Corte Clásico",fr:"Coupe Classique",de:"Klassischer Schnitt"}},
  {id:"s2",name:"Corte + Barba",     duration:50,price:25,active:true,
    names:{pt:"Corte + Barba",en:"Cut + Beard",es:"Corte + Barba",fr:"Coupe + Barbe",de:"Schnitt + Bart"}},
  {id:"s3",name:"Barba Completa",    duration:25,price:12,active:true,
    names:{pt:"Barba Completa",en:"Full Beard",es:"Barba Completa",fr:"Barbe Complète",de:"Komplette Bartpflege"}},
  {id:"s4",name:"Degradê",           duration:40,price:18,active:true,
    names:{pt:"Degradê",en:"Fade",es:"Degradado",fr:"Dégradé",de:"Fade Cut"}},
  {id:"s5",name:"Tratamento Capilar",duration:45,price:22,active:true,
    names:{pt:"Tratamento Capilar",en:"Hair Treatment",es:"Tratamiento Capilar",fr:"Soin Capillaire",de:"Haarbehandlung"}},
];
const INIT_BARBERS = [
  {id:"b1",name:"Luis Correia",role:"Barbeiro Sênior",pin:"1984",phone:"+351 912 345 678",bio:"Especialista em cortes clássicos e barba.",avatar:"LC",color:"#b8955a",schedule:{workDays:[1,2,3,4,5],startHour:"09:00",endHour:"18:00"},active:true},
  {id:"b2",name:"André Silva",role:"Barbeiro",pin:"2000",phone:"+351 913 000 111",bio:"Especialista em degradê e cortes modernos.",avatar:"AS",color:"#6a9eb8",schedule:{workDays:[2,3,4,5,6],startHour:"10:00",endHour:"19:00"},active:true},
  {id:"b3",name:"Rui Mendes",role:"Barbeiro Junior",pin:"1111",phone:"+351 914 111 222",bio:"Cortes rápidos e modernos.",avatar:"RM",color:"#9e6a4a",schedule:{workDays:[1,3,5,6],startHour:"09:00",endHour:"17:00"},active:true},
];
const INIT_SHOP = {name:"LC.84 Barber Vision",address:"Rua do Comércio, 84 — Lisboa",phone:"+351 912 345 678",bio:"Barbearia de luxo com mais de 10 anos de experiência.",adminPin:"admin"};

// seed client notes
const INIT_CLIENT_NOTES = {};

// ─── MULTI-SHOP HELPERS ──────────────────────────────────────────────────────
function slugify(str){
  return (str||"")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"") // remove accents
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/(^-|-$)/g,"")
    .slice(0,30) || "loja";
}
async function generateUniqueSlug(base){
  let slug = slugify(base);
  let attempt = slug;
  let n = 2;
  while(true){
    const {data} = await supabase.from("shops").select("id").eq("slug",attempt).maybeSingle();
    if(!data) return attempt;
    attempt = `${slug}-${n}`;
    n++;
  }
}

function seedBookings(barbers) {
  const names  = ["Miguel Ferreira","João Costa","Rafael Santos","André Pinto","Carlos Mendes","Bruno Sousa","Tiago Lopes","Pedro Nunes","Rui Alves","Diogo Vieira","Marco Silva","Nuno Rodrigues"];
  const phones = ["912111001","913222002","914333003","915444004","916555005","917666006","918777007","919888008","910999009","911000010","912000011","913000012"];
  const days   = [fmt(new Date(Date.now()-2*86400000)),fmt(new Date(Date.now()-86400000)),TODAY,fmt(new Date(Date.now()+86400000)),fmt(new Date(Date.now()+2*86400000))];
  const slots  = [["09:00","s1"],["10:00","s2"],["11:00","s4"],["14:00","s3"],["15:30","s2"],["16:30","s1"]];
  const out = [];
  barbers.forEach((barber,bi)=>{
    days.forEach((date,di)=>{
      slots.slice(0,2+Math.min(di,3)).forEach(([time,sid],i)=>{
        const isPast=date<TODAY;
        out.push({id:mkId(),barberId:barber.id,date,time,serviceId:sid,
          name:names[(bi*20+di*5+i)%names.length],phone:phones[(bi*20+di*5+i)%phones.length],
          status:isPast?"concluído":di===2&&i===0?"concluído":"confirmado",
          paid:isPast,payMethod:isPast?"Dinheiro":"",notes:"",blocked:false});
      });
    });
  });
  return out;
}

function seedNotifications(barbers) {
  const now = Date.now();
  const out = [];
  barbers.forEach(b=>{
    out.push({id:mkId(),barberId:b.id,type:"reminder",title:"Marcações de hoje",body:`Tens ${3+Math.floor(Math.random()*3)} marcações hoje. A primeira às 09:00.`,ts:now-5*60000,read:false});
    out.push({id:mkId(),barberId:b.id,type:"new",title:"Nova marcação",body:"Miguel Ferreira marcou Corte Clássico para amanhã às 10:00.",ts:now-32*60000,read:false});
    out.push({id:mkId(),barberId:b.id,type:"cancel",title:"Marcação cancelada",body:"João Costa cancelou a marcação de hoje às 14:00.",ts:now-2*3600000,read:true});
    out.push({id:mkId(),barberId:b.id,type:"reminder",title:"Resumo de ontem",body:"Concluíste 4 serviços. Receita: €72.",ts:now-26*3600000,read:true});
  });
  return out;
}

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────
const Lbl = ({children,style}) => <div style={{fontSize:"0.57rem",letterSpacing:"0.25em",color:T.silver,textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",marginBottom:6,...style}}>{children}</div>;
const Inp = ({style,...p}) => <input {...p} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:4,padding:"10px 12px",color:T.white,fontSize:"0.95rem",outline:"none",...style}} onFocus={e=>e.target.style.borderColor=T.gold} onBlur={e=>e.target.style.borderColor=T.border}/>;
const Sel = ({style,children,...p}) => <select {...p} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:4,padding:"10px 12px",color:T.white,fontSize:"0.95rem",outline:"none",colorScheme:"dark",...style}}>{children}</select>;
const Txta = ({style,...p}) => <textarea {...p} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:4,padding:"10px 12px",color:T.white,fontSize:"0.9rem",outline:"none",resize:"none",...style}} onFocus={e=>e.target.style.borderColor=T.gold} onBlur={e=>e.target.style.borderColor=T.border}/>;
const Btn = ({children,variant="gold",style,...p}) => {
  const V={gold:{background:T.gold,color:"#000",border:`1px solid ${T.gold}`},ghost:{background:"transparent",color:T.mid,border:`1px solid ${T.border}`},danger:{background:T.redLo,color:T.red,border:`1px solid ${T.red}`},success:{background:T.greenLo,color:T.green,border:`1px solid ${T.green}`},blue:{background:T.blueLo,color:T.blue,border:`1px solid ${T.blue}`}};
  return <button className="tap" {...p} style={{padding:"11px 18px",borderRadius:4,cursor:"pointer",fontSize:"0.68rem",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:700,fontFamily:"'Josefin Sans',sans-serif",...V[variant],...style}}>{children}</button>;
};
const Tag = ({status}) => {
  const C={confirmado:{bg:T.goldLo,c:T.gold,l:"Confirmado"},concluído:{bg:T.greenLo,c:T.green,l:"Concluído"},cancelado:{bg:T.redLo,c:T.red,l:"Cancelado"},bloqueado:{bg:T.muted,c:T.silver,l:"Bloqueado"}};
  const cfg=C[status]||C.confirmado;
  return <span style={{fontSize:"0.55rem",letterSpacing:"0.12em",textTransform:"uppercase",padding:"2px 7px",borderRadius:3,background:cfg.bg,color:cfg.c,border:`1px solid ${cfg.c}`,fontFamily:"'Josefin Sans',sans-serif",whiteSpace:"nowrap"}}>{cfg.l}</span>;
};
const Hr = ({style}) => <div style={{height:1,background:T.border,...style}}/>;
const Avatar = ({barber,size=36}) => barber.photoUrl ? <img src={barber.photoUrl} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`2px solid ${barber.color}`,flexShrink:0}}/> : <div style={{width:size,height:size,borderRadius:"50%",background:`${barber.color}22`,border:`2px solid ${barber.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.32,fontWeight:700,color:barber.color,flexShrink:0,fontFamily:"'Josefin Sans',sans-serif"}}>{barber.avatar}</div>;

function Modal({onClose,title,children}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:300}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,background:T.surface,borderRadius:"14px 14px 0 0",border:`1px solid ${T.border}`,borderBottom:"none",padding:"20px 20px 48px",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{width:36,height:3,background:T.muted,borderRadius:2,margin:"0 auto 18px"}}/>
        {title&&<div style={{fontSize:"1.2rem",color:T.white,fontWeight:600,marginBottom:18}}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getBarberHours(barber){const{startHour,endHour}=barber.schedule;return ALL_HOURS.filter(h=>h>=startHour&&h<endHour);}
const SERVICE_NAME_TRANSLATIONS = {
  "Corte Clássico":    {pt:"Corte Clássico",en:"Classic Cut",es:"Corte Clásico",fr:"Coupe Classique",de:"Klassischer Schnitt"},
  "Corte + Barba":     {pt:"Corte + Barba",en:"Cut + Beard",es:"Corte + Barba",fr:"Coupe + Barbe",de:"Schnitt + Bart"},
  "Barba Completa":    {pt:"Barba Completa",en:"Full Beard",es:"Barba Completa",fr:"Barbe Complète",de:"Komplette Bartpflege"},
  "Degradê":           {pt:"Degradê",en:"Fade",es:"Degradado",fr:"Dégradé",de:"Fade Cut"},
  "Tratamento Capilar":{pt:"Tratamento Capilar",en:"Hair Treatment",es:"Tratamiento Capilar",fr:"Soin Capillaire",de:"Haarbehandlung"},
};
function svcName(s,lang){
  if(!s)return"";
  if(s.names?.[lang])return s.names[lang];
  const fallback=SERVICE_NAME_TRANSLATIONS[s.name];
  if(fallback?.[lang])return fallback[lang];
  return s.name||"";
}
function barberWorksOnDate(barber,dateStr){return barber.schedule.workDays.includes(new Date(dateStr+"T12:00:00").getDay());}

// ─── BOOKING FORM ─────────────────────────────────────────────────────────────
function BookingForm({initial,services,barbers,onSave,onDelete,onClose,fixedBarberId,lang}){
  const L=LANGS[lang].t;
  const [f,setF]=useState(initial);
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const ok=f.name.trim()&&f.time&&f.date;
  const hrs=f.barberId?getBarberHours(barbers.find(b=>b.id===f.barberId)||barbers[0]):ALL_HOURS;
  const statusLabel={confirmado:L.confirmed,concluído:L.done,cancelado:L.cancelled};
  return(
    <>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["confirmado","concluído","cancelado"].map(st=>(
          <button key={st} onClick={()=>u("status")(st)} style={{flex:1,padding:"7px 4px",borderRadius:4,cursor:"pointer",fontSize:"0.58rem",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",background:f.status===st?(st==="concluído"?T.greenLo:st==="cancelado"?T.redLo:T.goldLo):"transparent",color:f.status===st?(st==="concluído"?T.green:st==="cancelado"?T.red:T.gold):T.silver,border:`1px solid ${f.status===st?(st==="concluído"?T.green:st==="cancelado"?T.red:T.gold):T.border}`}}>{statusLabel[st]}</button>
        ))}
      </div>
      {!fixedBarberId&&<div style={{marginBottom:11}}><Lbl>{L.barberLabel}</Lbl><Sel value={f.barberId} onChange={e=>u("barberId")(e.target.value)}>{barbers.filter(b=>b.active).map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</Sel></div>}
      <div style={{marginBottom:11}}><Lbl>{L.clientName}</Lbl><Inp placeholder={L.fullName} value={f.name} onChange={e=>u("name")(e.target.value)}/></div>
      <div style={{marginBottom:11}}><Lbl>{L.phone}</Lbl><Inp placeholder="+351 9XX XXX XXX" value={f.phone} onChange={e=>u("phone")(e.target.value)}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:11}}>
        <div><Lbl>{L.date}</Lbl><Inp type="date" value={f.date} onChange={e=>u("date")(e.target.value)}/></div>
        <div><Lbl>{L.time}</Lbl><Sel value={f.time} onChange={e=>u("time")(e.target.value)}><option value="">— {L.time} —</option>{hrs.map(h=><option key={h} value={h}>{h}</option>)}</Sel></div>
      </div>
      <div style={{marginBottom:11}}><Lbl>{L.service}</Lbl><Sel value={f.serviceId} onChange={e=>u("serviceId")(e.target.value)}>{services.filter(s=>s.active).map(s=><option key={s.id} value={s.id}>{svcName(s,lang)} — €{s.price} ({s.duration}min)</option>)}</Sel></div>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:"0.85rem",color:f.paid?T.green:T.mid}}><input type="checkbox" checked={f.paid} onChange={e=>u("paid")(e.target.checked)} style={{accentColor:T.green}}/> {L.payment}</label>
          {f.paid&&<Sel value={f.payMethod} onChange={e=>u("payMethod")(e.target.value)} style={{flex:1,padding:"6px 10px",fontSize:"0.82rem"}}><option value="">{L.payMethod}</option>{LANGS[lang].pay.map(p=><option key={p} value={p}>{p}</option>)}</Sel>}
        </div>
      </div>
      <div style={{marginBottom:16}}><Lbl>{L.notes}</Lbl><Txta rows={2} placeholder={L.observations} value={f.notes} onChange={e=>u("notes")(e.target.value)}/></div>
      <div style={{display:"flex",gap:8}}>
        <Btn variant="gold" style={{flex:1}} onClick={()=>ok&&onSave(f)}>{L.save}</Btn>
        {onDelete&&<Btn variant="danger" onClick={onDelete}>{L.delete}</Btn>}
        <Btn variant="ghost" onClick={onClose}>{L.close}</Btn>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🔔 NOTIFICATIONS SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function BNotifications({notifications,setNotifications,barber,lang}){
  const L=LANGS[lang].t;
  const myNotifs=notifications.filter(n=>n.barberId===barber.id).sort((a,b)=>b.ts-a.ts);
  const unread=myNotifs.filter(n=>!n.read).length;

  const markAll=()=>setNotifications(p=>p.map(n=>n.barberId===barber.id?{...n,read:true}:n));
  const markOne=id=>setNotifications(p=>p.map(n=>n.id===id?{...n,read:true}:n));
  const delOne=id=>setNotifications(p=>p.filter(n=>n.id!==id));
  const clearAll=()=>setNotifications(p=>p.filter(n=>n.barberId!==barber.id));

  const typeIcon={reminder:"🔔",new:"✂",cancel:"✕",info:"ℹ"};
  const typeColor={reminder:T.gold,new:T.green,cancel:T.red,info:T.blue};

  return(
    <div style={{padding:"0 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <span style={{fontSize:"1.1rem",color:T.white,fontWeight:600}}>{L.notifications}</span>
          {unread>0&&<span style={{marginLeft:8,background:T.red,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:"0.62rem",fontFamily:"'Josefin Sans',sans-serif"}}>{unread}</span>}
        </div>
        <div style={{display:"flex",gap:6}}>
          {unread>0&&<Btn variant="ghost" style={{padding:"5px 10px",fontSize:"0.58rem"}} onClick={markAll}>{L.markAllRead}</Btn>}
          {myNotifs.length>0&&<Btn variant="danger" style={{padding:"5px 10px",fontSize:"0.58rem"}} onClick={clearAll}>{L.clearAllBtn}</Btn>}
        </div>
      </div>

      {myNotifs.length===0?(
        <div style={{textAlign:"center",padding:"50px 0",color:T.silver}}>
          <div style={{fontSize:"2rem",opacity:.2,marginBottom:8}}>🔔</div>
          {L.noNotifications}
        </div>
      ):myNotifs.map(n=>(
        <div key={n.id} className="row-h" onClick={()=>markOne(n.id)} style={{display:"flex",gap:12,padding:"13px 14px",marginBottom:7,background:n.read?T.card:`${typeColor[n.type]}0a`,border:`1px solid ${n.read?T.border:typeColor[n.type]+"44"}`,borderRadius:7,cursor:"pointer",position:"relative"}}>
          {!n.read&&<div style={{position:"absolute",top:12,right:12,width:7,height:7,borderRadius:"50%",background:typeColor[n.type]}}/>}
          <div style={{fontSize:"1.1rem",flexShrink:0,marginTop:2}}>{typeIcon[n.type]||"🔔"}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"0.9rem",color:n.read?T.light:T.white,fontWeight:n.read?400:600,marginBottom:3}}>{n.title}</div>
            <div style={{fontSize:"0.78rem",color:T.silver,lineHeight:1.5}}>{n.body}</div>
            <div style={{fontSize:"0.62rem",color:T.silver,marginTop:5,fontFamily:"'Josefin Sans',sans-serif"}}>{timeAgo(n.ts)}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();delOne(n.id);}} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:"0.8rem",alignSelf:"flex-start",padding:"2px 4px"}}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 👥 CLIENTS HISTORY SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function BClients({bookings,services,barber,clientNotes,setClientNotes,cutRecords,setCutRecords,shopId,lang}){
  const L=LANGS[lang].t;
  const [search,setSearch]=useState("");
  const [openClient,setOpenClient]=useState(null);
  const [editNote,setEditNote]=useState(false);
  const [noteText,setNoteText]=useState("");
  const [addingCut,setAddingCut]=useState(false);
  const [cutPhoto,setCutPhoto]=useState(null);
  const [cutNotes,setCutNotes]=useState("");
  const [cutBusy,setCutBusy]=useState(false);
  const [cutErr,setCutErr]=useState("");
  const [viewPhoto,setViewPhoto]=useState(null);
  const svc=id=>services.find(s=>s.id===id);

  // Build client map from this barber's bookings
  const clientMap=useMemo(()=>{
    const map={};
    bookings.filter(b=>b.barberId===barber.id&&!b.blocked).forEach(b=>{
      const key=b.phone||b.name;
      if(!map[key])map[key]={name:b.name,phone:b.phone,visits:[],totalSpent:0,lastVisit:"",firstVisit:""};
      map[key].visits.push(b);
      if(b.paid)map[key].totalSpent+=svc(b.serviceId)?.price||0;
      if(!map[key].lastVisit||b.date>map[key].lastVisit)map[key].lastVisit=b.date;
      if(!map[key].firstVisit||b.date<map[key].firstVisit)map[key].firstVisit=b.date;
    });
    return map;
  },[bookings,barber]);

  const clients=Object.values(clientMap).sort((a,b)=>b.visits.length-a.visits.length);
  const filtered=search.trim().length>1?clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search)):clients;

  const openProfile=c=>{
    setOpenClient(c);
    setNoteText(clientNotes[c.phone||c.name]||"");
    setEditNote(false);
    setAddingCut(false);setCutPhoto(null);setCutNotes("");setCutErr("");
  };
  const saveNote=()=>{
    const key=openClient.phone||openClient.name;
    setClientNotes(p=>({...p,[key]:noteText}));
    setEditNote(false);
  };

  // Histórico de cortes — isolado por barbeiro: só este barbeiro vê os cortes que ele próprio registou
  const cutKey=c=>`${barber.id}::${c.phone||c.name}`;
  const myCuts=c=>(cutRecords[cutKey(c)]||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
  const uploadCutPhoto=async(file)=>{
    if(!file||!shopId)return;
    if(file.size>5*1024*1024){setCutErr("A imagem é demasiado grande (máx. 5MB).");return;}
    setCutBusy(true);setCutErr("");
    const ext=file.name.split(".").pop();
    const path=`${shopId}/cortes/${barber.id}-${Date.now()}.${ext}`;
    const{error}=await supabase.storage.from("salon-photos").upload(path,file,{upsert:true});
    if(error){setCutBusy(false);setCutErr("Não foi possível enviar a imagem.");return;}
    const{data}=supabase.storage.from("salon-photos").getPublicUrl(path);
    setCutPhoto(data.publicUrl);
    setCutBusy(false);
  };
  const saveCutRecord=()=>{
    if(!cutPhoto){setCutErr("Adiciona uma foto do corte.");return;}
    const key=cutKey(openClient);
    const rec={id:Date.now().toString(36),date:TODAY,photoUrl:cutPhoto,notes:cutNotes.trim()};
    setCutRecords(p=>({...p,[key]:[...(p[key]||[]),rec]}));
    setAddingCut(false);setCutPhoto(null);setCutNotes("");setCutErr("");
  };
  const deleteCutRecord=recId=>{
    const key=cutKey(openClient);
    setCutRecords(p=>({...p,[key]:(p[key]||[]).filter(r=>r.id!==recId)}));
  };

  // fav service
  const favService=c=>{
    const map={};
    c.visits.forEach(v=>{const s=svc(v.serviceId);if(s){const n=svcName(s,lang);map[n]=(map[n]||0)+1;}});
    return Object.entries(map).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";
  };

  return(
    <div style={{padding:"0 20px"}}>
      <Inp placeholder={L.searchClient} value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:14}}/>
      <Lbl style={{marginBottom:10}}>{filtered.length} {L.clientWord}{filtered.length!==1?"s":""}</Lbl>

      {filtered.map(c=>{
        const key=c.phone||c.name;
        const note=clientNotes[key];
        const upcoming=c.visits.filter(v=>v.date>=TODAY&&v.status==="confirmado").sort((a,b)=>a.date.localeCompare(a.date));
        return(
          <div key={key} className="row-h" onClick={()=>openProfile(c)} style={{padding:"13px 14px",marginBottom:7,background:T.card,border:`1px solid ${T.border}`,borderRadius:6,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{fontSize:"1rem",color:T.white,fontWeight:500}}>{c.name}</div>
                  {upcoming.length>0&&<span style={{fontSize:"0.55rem",background:T.goldLo,color:T.gold,border:`1px solid ${T.gold}`,padding:"1px 6px",borderRadius:3,fontFamily:"'Josefin Sans',sans-serif",letterSpacing:"0.1em"}}>{L.bookedBadge}</span>}
                </div>
                <div style={{fontSize:"0.7rem",color:T.silver,marginTop:2}}>{c.phone} · {c.visits.length} {L.visits}{c.visits.length!==1?"s":""}</div>
                <div style={{fontSize:"0.66rem",color:T.silver,marginTop:1}}>{L.lastVisitLabel}: {dateLabel(c.lastVisit)} · {L.favorite}: {favService(c)}</div>
                {note&&<div style={{fontSize:"0.68rem",color:T.mid,marginTop:4,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📝 {note}</div>}
              </div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                <div style={{fontSize:"1rem",color:T.gold,fontWeight:600}}>€{c.totalSpent}</div>
                <div style={{fontSize:"0.6rem",color:T.silver}}>{L.totalSpent}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Client Profile Modal */}
      {openClient&&(()=>{
        const c=openClient;
        const key=c.phone||c.name;
        const note=clientNotes[key]||"";
        const sorted=c.visits.sort((a,b)=>b.date.localeCompare(a.date));
        const upcoming=sorted.filter(v=>v.date>=TODAY&&v.status==="confirmado");
        const past=sorted.filter(v=>v.date<TODAY||v.status==="concluído"||v.status==="cancelado");
        return(
          <Modal onClose={()=>setOpenClient(null)}>
            {/* Profile header */}
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:T.goldLo,border:`2px solid ${T.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",color:T.gold,fontWeight:700,fontFamily:"'Josefin Sans',sans-serif",flexShrink:0}}>
                {c.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"1.2rem",color:T.white,fontWeight:600}}>{c.name}</div>
                <div style={{fontSize:"0.75rem",color:T.silver,marginTop:2}}>{c.phone}</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:18}}>
              {[{l:L.statVisitsLabel,v:c.visits.length},{l:L.statSpentLabel,v:`€${c.totalSpent}`},{l:L.favorite,v:favService(c).split(" ")[0]}].map(s=>(
                <div key={s.l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:"10px 10px",textAlign:"center"}}>
                  <Lbl style={{marginBottom:4,textAlign:"center"}}>{s.l}</Lbl>
                  <div style={{fontSize:"1rem",color:T.gold,fontWeight:600,lineHeight:1}}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <Lbl style={{margin:0}}>{L.barberNotes}</Lbl>
                <button onClick={()=>setEditNote(e=>!e)} style={{background:"none",border:"none",color:T.gold,cursor:"pointer",fontSize:"0.7rem",fontFamily:"'Josefin Sans',sans-serif",letterSpacing:"0.1em"}}>
                  {editNote?L.cancel:`✏ ${L.edit}`}
                </button>
              </div>
              {editNote?(
                <>
                  <Txta rows={3} value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder={L.notePlaceholder}/>
                  <Btn variant="gold" style={{width:"100%",marginTop:8,padding:"8px"}} onClick={saveNote}>{L.saveNoteBtn}</Btn>
                </>
              ):(
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"10px 12px",fontSize:"0.82rem",color:note?T.mid:T.silver,fontStyle:note?"italic":"normal",minHeight:42}}>
                  {note||L.noNotes}
                </div>
              )}
            </div>

            {/* Histórico de cortes (fotos) — só visível para este barbeiro */}
            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <Lbl style={{margin:0}}>Histórico de cortes</Lbl>
                {!addingCut&&<button onClick={()=>{setAddingCut(true);setCutPhoto(null);setCutNotes("");setCutErr("");}} style={{background:"none",border:"none",color:T.gold,cursor:"pointer",fontSize:"0.7rem",fontFamily:"'Josefin Sans',sans-serif",letterSpacing:"0.1em"}}>+ Adicionar corte</button>}
              </div>
              {addingCut&&(
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:12,marginBottom:10}}>
                  {cutPhoto?(
                    <img src={cutPhoto} alt="" style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:5,marginBottom:8}}/>
                  ):(
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <label style={{flex:1}}>
                        <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>uploadCutPhoto(e.target.files?.[0])}/>
                        <div style={{padding:"14px 8px",textAlign:"center",background:T.surface,border:`1px dashed ${T.border}`,borderRadius:5,color:T.silver,fontSize:"0.72rem",cursor:"pointer"}}>
                          {cutBusy?"A enviar...":"📷 Ligar câmara"}
                        </div>
                      </label>
                      <label style={{flex:1}}>
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>uploadCutPhoto(e.target.files?.[0])}/>
                        <div style={{padding:"14px 8px",textAlign:"center",background:T.surface,border:`1px dashed ${T.border}`,borderRadius:5,color:T.silver,fontSize:"0.72rem",cursor:"pointer"}}>
                          {cutBusy?"A enviar...":"🖼️ Carregar ficheiro"}
                        </div>
                      </label>
                    </div>
                  )}
                  <Txta rows={2} placeholder="Notas técnicas (ex: máquina nº2 nas laterais, tesoura em cima)" value={cutNotes} onChange={e=>setCutNotes(e.target.value)} style={{marginBottom:8}}/>
                  {cutErr&&<div style={{color:T.red,fontSize:"0.7rem",marginBottom:8}}>{cutErr}</div>}
                  <div style={{display:"flex",gap:8}}>
                    <Btn variant="gold" style={{flex:1,padding:"8px"}} onClick={saveCutRecord}>Guardar corte</Btn>
                    <Btn variant="ghost" style={{padding:"8px"}} onClick={()=>setAddingCut(false)}>{L.cancel}</Btn>
                  </div>
                </div>
              )}
              {myCuts(c).length===0&&!addingCut?(
                <div style={{color:T.silver,fontSize:"0.78rem",padding:"6px 0"}}>Ainda não há cortes registados por ti para este cliente.</div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {myCuts(c).map(r=>(
                    <div key={r.id} onClick={()=>setViewPhoto(r)} style={{cursor:"pointer",position:"relative"}}>
                      <img src={r.photoUrl} alt="" style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:5,border:`1px solid ${T.border}`}}/>
                      <div style={{fontSize:"0.6rem",color:T.silver,marginTop:3,textAlign:"center"}}>{dateLabel(r.date)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            {upcoming.length>0&&(
              <div style={{marginBottom:16}}>
                <Lbl style={{marginBottom:8}}>{L.upcoming}</Lbl>
                {upcoming.map(v=>(
                  <div key={v.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",marginBottom:5,background:T.goldLo,border:`1px solid ${T.gold}44`,borderRadius:5}}>
                    <div>
                      <div style={{fontSize:"0.85rem",color:T.white}}>{svcName(svc(v.serviceId),lang)}</div>
                      <div style={{fontSize:"0.66rem",color:T.silver}}>{dateLabel(v.date)} · {v.time}h</div>
                    </div>
                    <div style={{fontSize:"0.82rem",color:T.gold}}>€{svc(v.serviceId)?.price}</div>
                  </div>
                ))}
              </div>
            )}

            {/* History */}
            <Lbl style={{marginBottom:8}}>{L.history}</Lbl>
            <div style={{maxHeight:220,overflowY:"auto"}}>
              {past.length===0?<div style={{color:T.silver,fontSize:"0.8rem",padding:"10px 0"}}>{L.noHistory}</div>
              :past.map(v=>(
                <div key={v.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div>
                    <div style={{fontSize:"0.85rem",color:T.light}}>{svcName(svc(v.serviceId),lang)}</div>
                    <div style={{fontSize:"0.65rem",color:T.silver,marginTop:2}}>{dateLabel(v.date)} · {v.time}h {v.paid?`· ${v.payMethod}`:""}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"0.82rem",color:v.paid?T.green:T.silver}}>€{svc(v.serviceId)?.price}</div>
                    <Tag status={v.status}/>
                  </div>
                </div>
              ))}
            </div>

            <Btn variant="ghost" style={{width:"100%",marginTop:16}} onClick={()=>setOpenClient(null)}>{L.close}</Btn>
          </Modal>
        );
      })()}

      {/* Ver foto de corte ampliada */}
      {viewPhoto&&(
        <Modal onClose={()=>setViewPhoto(null)} title="Corte">
          <img src={viewPhoto.photoUrl} alt="" style={{width:"100%",borderRadius:6,marginBottom:10}}/>
          <div style={{fontSize:"0.7rem",color:T.silver,marginBottom:8}}>{dateLabel(viewPhoto.date)}</div>
          {viewPhoto.notes&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"10px 12px",fontSize:"0.82rem",color:T.mid,fontStyle:"italic",marginBottom:12}}>{viewPhoto.notes}</div>}
          <div style={{display:"flex",gap:8}}>
            <Btn variant="danger" style={{flex:1}} onClick={()=>{deleteCutRecord(viewPhoto.id);setViewPhoto(null);}}>Apagar corte</Btn>
            <Btn variant="ghost" onClick={()=>setViewPhoto(null)}>{L.close}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BARBER SCREENS (Dashboard, Agenda, Reports, Schedule, Profile)
// ══════════════════════════════════════════════════════════════════════════════
function BDashboard({bookings,services,barber,lang}){
  const L=LANGS[lang].t;
  const svc=id=>services.find(s=>s.id===id);
  const myBk=bookings.filter(b=>b.barberId===barber.id&&!b.blocked);
  const todayBk=myBk.filter(b=>b.date===TODAY);
  const revenue=todayBk.filter(b=>b.paid).reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0);
  const pending=todayBk.filter(b=>b.status==="confirmado"&&!b.paid).reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0);
  const upcoming=myBk.filter(b=>b.date>=TODAY&&b.status==="confirmado").sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).slice(0,6);
  const weekBk=myBk.filter(b=>{const d=new Date(b.date+"T12:00:00"),t=new Date(TODAY+"T12:00:00");return d>=t&&d<new Date(t.getTime()+7*86400000);});
  return(
    <div style={{padding:"0 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,padding:"13px",background:T.card,border:`1px solid ${T.border}`,borderRadius:8}}>
        <Avatar barber={barber} size={46}/>
        <div>
          <div style={{fontSize:"1.05rem",color:T.white,fontWeight:600}}>{barber.name}</div>
          <div style={{fontSize:"0.68rem",color:T.silver}}>{barber.role}</div>
          <div style={{fontSize:"0.62rem",color:barber.color,marginTop:2,fontFamily:"'Josefin Sans',sans-serif"}}>
            {LANGS[lang].wdaysF.filter((_,i)=>barber.schedule.workDays.includes(i)).map(d=>d.slice(0,3)).join(" · ")} · {barber.schedule.startHour}–{barber.schedule.endHour}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        {[{l:L.revenue,v:`€${revenue}`,s:`€${pending} ${L.pendingRev}`,c:T.gold},{l:L.today,v:todayBk.length,s:`${todayBk.filter(b=>b.status==="concluído").length} ${L.concluded}`,c:T.white},{l:L.toConfirm,v:todayBk.filter(b=>b.status==="confirmado").length,s:L.pendingOpen,c:T.mid},{l:L.week,v:weekBk.length,s:L.bookings,c:T.mid}].map(s=>(
          <div key={s.l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:"12px 13px"}}>
            <Lbl style={{marginBottom:4}}>{s.l}</Lbl>
            <div style={{fontSize:"1.45rem",color:s.c,fontWeight:600,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:"0.64rem",color:T.silver,marginTop:4}}>{s.s}</div>
          </div>
        ))}
      </div>
      <Lbl style={{marginBottom:10}}>{L.nextBookings}</Lbl>
      {upcoming.length===0?<div style={{textAlign:"center",padding:"22px 0",color:T.silver,fontSize:"0.88rem"}}>{L.noFuture}</div>
      :upcoming.map(b=>(
        <div key={b.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:T.card,border:`1px solid ${T.border}`,borderRadius:6}}>
          <div style={{textAlign:"center",minWidth:44}}>
            <div style={{fontSize:"0.85rem",color:T.gold,fontFamily:"'Josefin Sans',sans-serif",fontWeight:600}}>{b.time}</div>
            <div style={{fontSize:"0.56rem",color:T.silver}}>{dateLabel(b.date)}</div>
          </div>
          <Hr style={{width:1,height:26,alignSelf:"center"}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"0.92rem",color:T.white,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div>
            <div style={{fontSize:"0.7rem",color:T.silver}}>{svcName(svc(b.serviceId),lang)}</div>
          </div>
          <div style={{fontSize:"0.88rem",color:T.gold}}>€{svc(b.serviceId)?.price}</div>
        </div>
      ))}
    </div>
  );
}

function BAgenda({bookings,setBookings,services,barbers,barber,addNotification,lang}){
  const L=LANGS[lang].t;
  const WD=LANGS[lang].wdays;
  const [selDate,setSelDate]=useState(TODAY);
  const [modal,setModal]=useState(null);
  const [blocking,setBlocking]=useState(false);
  const [blockMode,setBlockMode]=useState("slot"); // slot | day | period
  const [blockPeriod,setBlockPeriod]=useState({start:"",end:""});
  const [blockRange,setBlockRange]=useState({start:"",end:""});

  const addBlockDay=()=>{
    setBookings(p=>[...p,{id:mkId(),barberId:barber.id,date:selDate,time:"DIA_INTEIRO",blocked:true,name:"Dia Bloqueado",status:"bloqueado",serviceId:"s1",phone:"",paid:false,payMethod:"",notes:""}]);
    setBlocking(false);
  };
  const addBlockPeriod=()=>{
    if(!blockPeriod.start||!blockPeriod.end)return;
    const start=new Date(blockPeriod.start+"T12:00:00");
    const end=new Date(blockPeriod.end+"T12:00:00");
    const days=[];
    for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1))days.push(fmt(new Date(d)));
    setBookings(p=>[...p,...days.map(date=>({id:mkId(),barberId:barber.id,date,time:"DIA_INTEIRO",blocked:true,name:"Período Bloqueado",status:"bloqueado",serviceId:"s1",phone:"",paid:false,payMethod:"",notes:""}))]);
    setBlockPeriod({start:"",end:""});
    setBlocking(false);
  };
  const addBlockRange=()=>{
  if(!blockRange.start||!blockRange.end||blockRange.end<=blockRange.start)return;
  const slots=hours.filter(h=>h>=blockRange.start&&h<blockRange.end&&!dayBk.find(b=>b.time===h));
  setBookings(p=>[...p,...slots.map(time=>({id:mkId(),barberId:barber.id,date:selDate,time,blocked:true,name:"Ausência",status:"bloqueado",serviceId:"s1",phone:"",paid:false,payMethod:"",notes:""}))]);
  setBlockRange({start:"",end:""});
  setBlocking(false);
};
const isDayFullyBlocked=date=>bookings.some(b=>b.barberId===barber.id&&b.date===date&&b.time==="DIA_INTEIRO"&&b.blocked);
  const unblockDay=date=>setBookings(p=>p.filter(b=>!(b.barberId===barber.id&&b.date===date&&b.time==="DIA_INTEIRO"&&b.blocked)));
  const svc=id=>services.find(s=>s.id===id);
  const hours=getBarberHours(barber);
  const dayBk=useMemo(()=>bookings.filter(b=>b.barberId===barber.id&&b.date===selDate).sort((a,b)=>a.time.localeCompare(b.time)),[bookings,selDate,barber]);
  const strip=Array.from({length:7}).map((_,i)=>{const d=new Date(Date.now()+i*86400000);return{str:fmt(d),d};});
  const openAdd=(time="")=>setModal({mode:"add",data:{id:null,barberId:barber.id,date:selDate,time,serviceId:"s1",name:"",phone:"",status:"confirmado",paid:false,payMethod:"",notes:"",blocked:false}});
  const openEdit=b=>setModal({mode:"edit",data:{...b}});
  const save=f=>{
    if(f.id){setBookings(p=>p.map(b=>b.id===f.id?f:b));}
    else{
      setBookings(p=>[...p,{...f,id:mkId()}]);
      addNotification(barber.id,"new","Nova marcação adicionada",`${f.name} — ${svcName(svc(f.serviceId),lang)} — ${f.date} às ${f.time}h`);
    }
    setModal(null);
  };
  const del=id=>{
    const b=bookings.find(b=>b.id===id);
    if(b)addNotification(barber.id,"cancel","Marcação eliminada",`${b.name} — ${dateLabel(b.date)} às ${b.time}h foi removida.`);
    setBookings(p=>p.filter(b=>b.id!==id));setModal(null);
  };
  const qStatus=(id,st)=>{
    setBookings(p=>p.map(b=>b.id===id?{...b,status:st}:b));
    if(st==="cancelado"){const b=bookings.find(b=>b.id===id);if(b)addNotification(barber.id,"cancel","Marcação cancelada",`${b.name} cancelou — ${dateLabel(b.date)} às ${b.time}h.`);}
  };
  const qPaid=id=>setBookings(p=>p.map(b=>b.id===id?{...b,paid:!b.paid}:b));
  const addBlock=time=>setBookings(p=>[...p,{id:mkId(),barberId:barber.id,date:selDate,time,blocked:true,name:"Bloqueado",status:"bloqueado",serviceId:"s1",phone:"",paid:false,payMethod:"",notes:""}]);
  const worksToday=barberWorksOnDate(barber,selDate);
  return(
    <div style={{padding:"0 20px"}}>
      {/* strip */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:14,scrollbarWidth:"none"}}>
        {strip.map(({str,d})=>{
          const cnt=bookings.filter(b=>b.barberId===barber.id&&b.date===str&&!b.blocked).length;
          const works=barberWorksOnDate(barber,str),sel=str===selDate;
          const fullyBlocked=isDayFullyBlocked(str);
          return(<div key={str} onClick={()=>setSelDate(str)} style={{minWidth:47,borderRadius:6,padding:"8px 4px",textAlign:"center",cursor:"pointer",flexShrink:0,background:sel?T.gold:fullyBlocked?T.redLo:T.card,border:`1px solid ${sel?T.gold:fullyBlocked?T.red:works?T.border:T.muted}`,opacity:works?1:0.4}}>
            <div style={{fontSize:"0.52rem",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",color:sel?"#000":fullyBlocked?T.red:T.silver,marginBottom:3}}>{WD[d.getDay()]}</div>
            <div style={{fontSize:"0.97rem",fontWeight:600,color:sel?"#000":fullyBlocked?T.red:T.white,lineHeight:1}}>{d.getDate()}</div>
            {fullyBlocked?<div style={{fontSize:"0.45rem",color:sel?"#000":T.red,marginTop:3}}>🔒</div>:cnt>0&&<div style={{width:4,height:4,borderRadius:"50%",background:sel?"#000":T.gold,margin:"3px auto 0"}}/>}
          </div>);
        })}
      </div>
      {!worksToday?<div style={{textAlign:"center",padding:"40px 0",color:T.silver}}><div style={{fontSize:"1.5rem",opacity:.18,marginBottom:8}}>🔒</div>{L.holiday}</div>:(
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><span style={{fontSize:"1.08rem",color:T.white,fontWeight:600}}>{dateLabel(selDate)}</span><span style={{fontSize:"0.68rem",color:T.silver,marginLeft:8}}>{dayBk.filter(b=>!b.blocked).length} {L.bookings}</span></div>
            <div style={{display:"flex",gap:6}}>
              <Btn variant="ghost" style={{padding:"5px 9px",fontSize:"0.56rem"}} onClick={()=>setBlocking(b=>!b)}>🔒</Btn>
              <Btn variant="gold" style={{padding:"5px 11px"}} onClick={()=>openAdd()}>{L.newBooking}</Btn>
            </div>
          </div>
          {/* Day fully blocked banner */}
          {isDayFullyBlocked(selDate)&&(
            <div style={{background:T.redLo,border:`1px solid ${T.red}`,borderRadius:7,padding:"12px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:"0.85rem",color:T.red,fontWeight:600}}>🔒 {L.dayBlocked}</div>
              <button onClick={()=>unblockDay(selDate)} style={{padding:"4px 10px",background:"none",border:`1px solid ${T.red}`,borderRadius:4,color:T.red,cursor:"pointer",fontSize:"0.62rem",fontFamily:"'Josefin Sans',sans-serif",letterSpacing:"0.1em"}}>{L.unblock}</button>
            </div>
          )}

          {blocking&&(
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:14,marginBottom:12}}>
              {/* Mode tabs */}
              <div style={{display:"flex",gap:5,marginBottom:12}}>
                {[["slot",L.blockSlot],["hours",L.blockHours],["day",L.blockDay],["period",L.blockPeriod]].map(([id,l])=>(
                  <button key={id} onClick={()=>setBlockMode(id)} style={{flex:1,padding:"6px 4px",borderRadius:4,cursor:"pointer",fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",background:blockMode===id?T.redLo:"transparent",color:blockMode===id?T.red:T.silver,border:`1px solid ${blockMode===id?T.red:T.border}`}}>{l}</button>
                ))}
              </div>

              {blockMode==="slot"&&(<>
                <Lbl style={{marginBottom:8}}>{L.blockSlotTitle}</Lbl>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {hours.filter(h=>!dayBk.find(b=>b.time===h)).map(h=>(
                    <button key={h} onClick={()=>{addBlock(h);setBlocking(false);}} style={{padding:"5px 10px",background:T.muted,border:`1px solid ${T.border}`,borderRadius:4,color:T.mid,fontSize:"0.75rem",cursor:"pointer",fontFamily:"'Josefin Sans',sans-serif"}}>{h}</button>
                  ))}
                </div>
              </>)}

              {blockMode==="hours"&&(<>
  <Lbl style={{marginBottom:8}}>{L.blockHoursTitle}</Lbl>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
    <div><Lbl>{L.fromDate}</Lbl><Sel value={blockRange.start} onChange={e=>setBlockRange(p=>({...p,start:e.target.value}))}><option value="">--</option>{hours.map(h=><option key={h} value={h}>{h}</option>)}</Sel></div>
    <div><Lbl>{L.toDate}</Lbl><Sel value={blockRange.end} onChange={e=>setBlockRange(p=>({...p,end:e.target.value}))}><option value="">--</option>{hours.map(h=><option key={h} value={h}>{h}</option>)}</Sel></div>
  </div>
  <Btn variant="danger" style={{width:"100%"}} onClick={addBlockRange}>🔒 {L.blockHoursTitle}</Btn>
</>)}

              {blockMode==="day"&&(<>
                <Lbl style={{marginBottom:8}}>{L.blockDayTitle} — {dateLabel(selDate)}</Lbl>
                <div style={{fontSize:"0.8rem",color:T.silver,marginBottom:12}}>{L.noBookingCanBeMade}</div>
                <Btn variant="danger" style={{width:"100%"}} onClick={addBlockDay}>🔒 {L.blockDayTitle}</Btn>
              </>)}

              {blockMode==="period"&&(<>
                <Lbl style={{marginBottom:8}}>{L.blockPeriodTitle}</Lbl>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  <div><Lbl>{L.fromDate}</Lbl><Inp type="date" value={blockPeriod.start} onChange={e=>setBlockPeriod(p=>({...p,start:e.target.value}))}/></div>
                  <div><Lbl>{L.toDate}</Lbl><Inp type="date" value={blockPeriod.end} onChange={e=>setBlockPeriod(p=>({...p,end:e.target.value}))}/></div>
                </div>
                {blockPeriod.start&&blockPeriod.end&&blockPeriod.end>=blockPeriod.start&&(
                  <div style={{fontSize:"0.76rem",color:T.silver,marginBottom:10}}>
                    {Math.round((new Date(blockPeriod.end)-new Date(blockPeriod.start))/86400000)+1} {L.blockDays}
                  </div>
                )}
                <Btn variant="danger" style={{width:"100%"}} onClick={addBlockPeriod}>🔒 {L.blockPeriodTitle}</Btn>
              </>)}

              <Btn variant="ghost" style={{marginTop:10,width:"100%",padding:"6px",fontSize:"0.58rem"}} onClick={()=>setBlocking(false)}>{L.cancel}</Btn>
            </div>
          )}
          {!isDayFullyBlocked(selDate)&&dayBk.length===0?<div style={{textAlign:"center",padding:"36px 0",color:T.silver}}><div style={{fontSize:"1.5rem",opacity:.18,marginBottom:8}}>✂</div>{L.noBookingsShort}</div>
          :dayBk.map(b=>{
            const s=svc(b.serviceId);
            if(b.blocked)return(<div key={b.id} style={{display:"flex",alignItems:"center",marginBottom:7,borderRadius:6,overflow:"hidden",border:`1px solid ${T.border}`}}>
              <div style={{minWidth:52,padding:"11px 8px",background:T.muted,textAlign:"center"}}><div style={{fontSize:"0.82rem",color:T.silver,fontFamily:"'Josefin Sans',sans-serif"}}>{b.time}</div></div>
              <div style={{flex:1,padding:"11px 12px",background:T.card}}><div style={{fontSize:"0.76rem",color:T.silver}}>{L.blockedSlotLabel}</div></div>
              <button onClick={()=>del(b.id)} style={{padding:"0 12px",height:"100%",background:"none",border:"none",borderLeft:`1px solid ${T.border}`,color:T.silver,cursor:"pointer"}}>✕</button>
            </div>);
            return(<div key={b.id} style={{display:"flex",marginBottom:7,borderRadius:6,overflow:"hidden",border:`1px solid ${T.border}`,cursor:"pointer"}} onClick={()=>openEdit(b)}>
              <div style={{minWidth:52,padding:"12px 8px",background:T.card,borderRight:`1px solid ${T.border}`,textAlign:"center",flexShrink:0}}>
                <div style={{fontSize:"0.85rem",color:T.gold,fontFamily:"'Josefin Sans',sans-serif",fontWeight:600}}>{b.time}</div>
                <div style={{fontSize:"0.54rem",color:T.silver,marginTop:2}}>{s?.duration}m</div>
              </div>
              <div style={{flex:1,padding:"10px 11px",background:T.surface,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:"0.92rem",color:T.white,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div>
                    <div style={{fontSize:"0.7rem",color:T.silver,marginTop:2}}>{s?.name}</div>
                    {b.phone&&<div style={{fontSize:"0.64rem",color:T.silver,marginTop:1}}>{b.phone}</div>}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:"0.88rem",color:T.gold,fontWeight:600,marginBottom:3}}>€{s?.price}</div>
                    <Tag status={b.status}/>
                    {b.paid&&<div style={{fontSize:"0.5rem",color:T.green,marginTop:3,fontFamily:"'Josefin Sans',sans-serif"}}>✓ {L.payment.toUpperCase()}</div>}
                  </div>
                </div>
              </div>
              <div onClick={e=>e.stopPropagation()} style={{display:"flex",flexDirection:"column",background:T.card,borderLeft:`1px solid ${T.border}`,flexShrink:0}}>
                {[{icon:"✓",k:"concluído",c:T.green,a:b.status==="concluído"},{icon:"€",k:"paid",c:T.gold,a:b.paid},{icon:"✕",k:"cancelado",c:T.red,a:b.status==="cancelado"}].map(({icon,k,c,a})=>(
                  <button key={k} onClick={()=>k==="paid"?qPaid(b.id):qStatus(b.id,k)} style={{flex:1,width:29,border:"none",cursor:"pointer",fontSize:"0.74rem",borderBottom:`1px solid ${T.border}`,background:a?`${c}22`:"transparent",color:a?c:T.muted}}>{icon}</button>
                ))}
              </div>
            </div>);
          })}
          {(()=>{const free=hours.filter(h=>!dayBk.find(b=>b.time===h));if(!free.length)return null;return(<div style={{marginTop:14}}><Lbl style={{marginBottom:7}}>{L.freeSlots}</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{free.map(h=><button key={h} className="slot-h" onClick={()=>openAdd(h)} style={{padding:"4px 9px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.silver,fontSize:"0.73rem",cursor:"pointer",transition:"all .15s",fontFamily:"'Josefin Sans',sans-serif"}}>{h}</button>)}</div></div>);})()}
        </>
      )}
      {modal&&<Modal onClose={()=>setModal(null)} title={modal.mode==="add"?L.addBooking:L.editBooking}><BookingForm initial={modal.data} services={services} barbers={barbers} onSave={save} onDelete={modal.mode==="edit"?()=>del(modal.data.id):null} onClose={()=>setModal(null)} fixedBarberId={barber.id} lang={lang}/></Modal>}
    </div>
  );
}

// ─── CONFIRM PAYMENT MODAL ───────────────────────────────────────────────────
function ConfirmPayModal({booking,svc,onConfirm,onClose,lang}){
  const L=LANGS[lang].t;
  const [method,setMethod]=useState(booking.payMethod||"");
  const s=svc(booking.serviceId);
  return(
    <Modal onClose={onClose} title={L.payConfirm}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:"14px",marginBottom:18}}>
        <div style={{fontSize:"1rem",color:T.white,fontWeight:500,marginBottom:4}}>{booking.name}</div>
        <div style={{fontSize:"0.8rem",color:T.silver,marginBottom:2}}>{s?.name} · {booking.time}h · {dateLabel(booking.date)}</div>
        <div style={{fontSize:"1.3rem",color:T.gold,fontWeight:700,marginTop:10}}>€{s?.price}</div>
      </div>
      <Lbl style={{marginBottom:8}}>{L.paymentMethod}</Lbl>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
        {LANGS[lang].pay.map(p=>(
          <button key={p} onClick={()=>setMethod(p)} style={{padding:"9px 14px",borderRadius:4,cursor:"pointer",fontSize:"0.78rem",fontFamily:"'Josefin Sans',sans-serif",background:method===p?T.goldLo:"transparent",color:method===p?T.gold:T.mid,border:`1px solid ${method===p?T.gold:T.border}`,fontWeight:method===p?700:400}}>{p}</button>
        ))}
      </div>
      <Btn variant="gold" style={{width:"100%"}} onClick={()=>method&&onConfirm(booking.id,method)}>{L.confirmAmountBtn} €{s?.price}</Btn>
      <Btn variant="ghost" style={{width:"100%",marginTop:8}} onClick={onClose}>{L.cancel}</Btn>
    </Modal>
  );
}

// ─── PRINT REPORT ─────────────────────────────────────────────────────────────
function PrintReport({bookings,label,barberName,svc,onClose,lang}){
  const L=LANGS[lang].t;
  const confirmed=bookings.filter(b=>b.status==="concluído"&&b.paid);
  const pending=bookings.filter(b=>b.status==="concluído"&&!b.paid);
  const cancelled=bookings.filter(b=>b.status==="cancelado");
  const total=confirmed.reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0);
  const pendingTotal=pending.reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0);
  const byMethod={};
  confirmed.forEach(b=>{const m=b.payMethod||"Outro";byMethod[m]=(byMethod[m]||0)+(svc(b.serviceId)?.price||0);});
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:"20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:480,background:"#fff",borderRadius:8,padding:"28px",maxHeight:"90vh",overflowY:"auto",color:"#111",fontFamily:"'Josefin Sans',sans-serif"}}>
        <div style={{textAlign:"center",borderBottom:"2px solid #111",paddingBottom:14,marginBottom:18}}>
          <div style={{fontSize:"1.3rem",fontWeight:700,letterSpacing:"0.15em"}}>LC.84 BARBER VISION</div>
          <div style={{fontSize:"0.72rem",color:"#555",marginTop:3,letterSpacing:"0.2em",textTransform:"uppercase"}}>{L.reportLabel} — {label}</div>
          <div style={{fontSize:"0.7rem",color:"#555",marginTop:2}}>{L.barberLabel}: {barberName}</div>
          <div style={{fontSize:"0.66rem",color:"#888",marginTop:2}}>{L.issuedOn} {NOW.getDate()} {LANGS[lang].months[NOW.getMonth()]} {NOW.getFullYear()}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
          {[{l:L.billed,v:`€${total}`,c:"#4a8a5f"},{l:L.services,v:confirmed.length,c:"#111"},{l:L.pendingRev,v:`€${pendingTotal}`,c:"#9e4040"}].map(s=>(
            <div key={s.l} style={{border:"1px solid #ddd",borderRadius:5,padding:"9px",textAlign:"center"}}>
              <div style={{fontSize:"0.58rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"#888",marginBottom:3}}>{s.l}</div>
              <div style={{fontSize:"1.1rem",fontWeight:700,color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>
        {Object.keys(byMethod).length>0&&(<>
          <div style={{fontSize:"0.62rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"#888",marginBottom:8,borderTop:"1px solid #ddd",paddingTop:12}}>{L.byMethod}</div>
          {Object.entries(byMethod).map(([m,v])=>(
            <div key={m} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #eee",fontSize:"0.82rem"}}><span>{m}</span><span style={{fontWeight:700}}>€{v}</span></div>
          ))}
        </>)}
        <div style={{fontSize:"0.62rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"#888",marginBottom:8,borderTop:"1px solid #ddd",paddingTop:12,marginTop:12}}>{L.paidServices} ({confirmed.length})</div>
        {confirmed.sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).map(b=>(
          <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f0f0f0",fontSize:"0.78rem"}}>
            <div><span style={{fontWeight:600}}>{b.name}</span><span style={{color:"#888",marginLeft:6}}>{svcName(svc(b.serviceId),lang)}</span></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:"0.7rem",color:"#888"}}>{b.date} {b.time}</div><div style={{fontWeight:700,color:"#4a8a5f"}}>€{svc(b.serviceId)?.price} <span style={{fontSize:"0.62rem",color:"#888"}}>({b.payMethod})</span></div></div>
          </div>
        ))}
        {pending.length>0&&(<>
          <div style={{fontSize:"0.62rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"#9e4040",marginBottom:8,borderTop:"1px solid #ddd",paddingTop:12,marginTop:12}}>⚠ {L.unconfirmedPayment} ({pending.length})</div>
          {pending.map(b=>(
            <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f0f0f0",fontSize:"0.78rem"}}>
              <div><span style={{fontWeight:600}}>{b.name}</span><span style={{color:"#888",marginLeft:6}}>{svcName(svc(b.serviceId),lang)}</span></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:"0.7rem",color:"#888"}}>{b.date} {b.time}</div><div style={{fontWeight:700,color:"#9e4040"}}>€{svc(b.serviceId)?.price} — {L.unconfirmedPayment}</div></div>
            </div>
          ))}
        </>)}
        {cancelled.length>0&&(<>
          <div style={{fontSize:"0.62rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"#888",marginBottom:8,borderTop:"1px solid #ddd",paddingTop:12,marginTop:12}}>{L.cancelled} ({cancelled.length})</div>
          {cancelled.map(b=>(
            <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:"0.75rem",color:"#999"}}><span>{b.name} · {svcName(svc(b.serviceId),lang)}</span><span>{b.date} {b.time}</span></div>
          ))}
        </>)}
        <div style={{marginTop:18,paddingTop:12,borderTop:"2px solid #111",textAlign:"center",fontSize:"0.66rem",color:"#888"}}>LC.84 BARBER VISION · {NOW.getDate()} {LANGS[lang].months[NOW.getMonth()]} {NOW.getFullYear()}</div>
        <div style={{display:"flex",gap:8,marginTop:16}}>
          <button onClick={()=>window.print()} style={{flex:1,padding:"11px",background:"#111",color:"#fff",border:"none",borderRadius:4,cursor:"pointer",fontSize:"0.68rem",letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",fontWeight:700}}>🖨 {L.printBtn}</button>
          <button onClick={onClose} style={{padding:"11px 14px",background:"transparent",color:"#666",border:"1px solid #ddd",borderRadius:4,cursor:"pointer",fontSize:"0.68rem",fontFamily:"'Josefin Sans',sans-serif"}}>{L.close}</button>
        </div>
      </div>
    </div>
  );
}

function BReports({bookings,setBookings,services,barber,lang}){
  const L=LANGS[lang].t;
  const svc=id=>services.find(s=>s.id===id);
  const [period,setPeriod]=useState("today");
  const [confirmModal,setConfirmModal]=useState(null);
  const [printModal,setPrintModal]=useState(null);
  const [alertsOpen,setAlertsOpen]=useState(true);

  const myBk=useMemo(()=>bookings.filter(b=>b.barberId===barber.id&&!b.blocked),[bookings,barber]);

  const periodBk=useMemo(()=>{
    const t=new Date(TODAY+"T12:00:00");
    return myBk.filter(b=>{
      const d=new Date(b.date+"T12:00:00");
      if(period==="today") return b.date===TODAY;
      if(period==="week")  return d>=new Date(t.getTime()-6*86400000)&&d<=t;
      if(period==="month") return d.getMonth()===t.getMonth()&&d.getFullYear()===t.getFullYear();
      return true;
    });
  },[myBk,period]);

  const confirmed=useMemo(()=>periodBk.filter(b=>b.status==="concluído"&&b.paid),[periodBk]);
  const pending  =useMemo(()=>periodBk.filter(b=>b.status==="concluído"&&!b.paid),[periodBk]);
  const scheduled=useMemo(()=>periodBk.filter(b=>b.status==="confirmado"&&b.date>=TODAY),[periodBk]);
  const cancelled=useMemo(()=>periodBk.filter(b=>b.status==="cancelado"),[periodBk]);

  // all unconfirmed payments across all time for this barber (not just period)
  const allPending=useMemo(()=>myBk.filter(b=>b.status==="concluído"&&!b.paid),[myBk]);

  const totalConfirmed=confirmed.reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0);
  const totalPending  =pending.reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0);
  const totalScheduled=scheduled.reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0);

  const byMethod=useMemo(()=>{
    const m={};confirmed.forEach(b=>{const pm=b.payMethod||"Outro";m[pm]=(m[pm]||0)+(svc(b.serviceId)?.price||0);});
    return Object.entries(m).sort((a,b)=>b[1]-a[1]);
  },[confirmed]);

  const chartDays=useMemo(()=>Array.from({length:7}).map((_,i)=>{
    const d=new Date(Date.now()-(6-i)*86400000),str=fmt(d);
    const rev=myBk.filter(b=>b.date===str&&b.status==="concluído"&&b.paid).reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0);
    return{label:LANGS[lang].wdays[d.getDay()],str,rev};
  }),[myBk,lang]);
  const maxRev=Math.max(...chartDays.map(d=>d.rev),1);

  const svcBreakdown=useMemo(()=>{
    const m={};confirmed.forEach(b=>{const s=svc(b.serviceId);if(!s)return;if(!m[s.id])m[s.id]={name:svcName(s,lang),count:0,total:0};m[s.id].count++;m[s.id].total+=s.price;});
    return Object.values(m).sort((a,b)=>b.total-a.total);
  },[confirmed]);
  const maxSvc=Math.max(...svcBreakdown.map(s=>s.total),1);

  const confirmPayment=(id,method)=>{
    setBookings(p=>p.map(b=>b.id===id?{...b,paid:true,payMethod:method}:b));
    setConfirmModal(null);
  };

  const PERIODS=[{id:"today",l:L.today},{id:"week",l:L.week},{id:"month",l:LANGS[lang].months[NOW.getMonth()].slice(0,3)},{id:"all",l:L.all}];

  const printBk=(type)=>myBk.filter(b=>{
    const d=new Date(b.date+"T12:00:00"),t=new Date(TODAY+"T12:00:00");
    if(type==="today")return b.date===TODAY;
    return d.getMonth()===t.getMonth()&&d.getFullYear()===t.getFullYear();
  });

  return(
    <div style={{padding:"0 20px"}}>

      {/* ⚠️ GLOBAL ALERT — all unconfirmed payments */}
      {allPending.length>0&&(
        <div style={{background:T.redLo,border:`1px solid ${T.red}`,borderRadius:8,marginBottom:16,overflow:"hidden"}}>
          <div onClick={()=>setAlertsOpen(a=>!a)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span>⚠</span>
              <div>
                <div style={{fontSize:"0.85rem",color:T.red,fontWeight:600}}>{allPending.length} {L.servicesUnconfirmed}</div>
                <div style={{fontSize:"0.68rem",color:T.red,opacity:0.8,marginTop:1}}>€{allPending.reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0)} {L.pendingRev}</div>
              </div>
            </div>
            <span style={{color:T.red,fontSize:"0.8rem"}}>{alertsOpen?"▲":"▼"}</span>
          </div>
          {alertsOpen&&(
            <div style={{borderTop:`1px solid ${T.red}44`}}>
              {allPending.sort((a,b)=>b.date.localeCompare(a.date)).map(b=>(
                <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:`1px solid ${T.red}22`}}>
                  <div>
                    <div style={{fontSize:"0.88rem",color:T.light,fontWeight:500}}>{b.name}</div>
                    <div style={{fontSize:"0.68rem",color:T.silver,marginTop:2}}>{svcName(svc(b.serviceId),lang)} · {dateLabel(b.date)} {b.time}h</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                    <div style={{fontSize:"0.9rem",color:T.red,fontWeight:700,marginBottom:4}}>€{svc(b.serviceId)?.price}</div>
                    <button onClick={()=>setConfirmModal(b)} style={{padding:"4px 10px",background:T.gold,color:"#000",border:"none",borderRadius:3,cursor:"pointer",fontSize:"0.6rem",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",fontWeight:700}}>{L.toConfirm}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Period tabs */}
      <div style={{display:"flex",gap:4,marginBottom:16}}>
        {PERIODS.map(p=>(
          <button key={p.id} onClick={()=>setPeriod(p.id)} style={{flex:1,padding:"8px 4px",borderRadius:4,cursor:"pointer",fontSize:"0.62rem",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",fontWeight:period===p.id?700:400,background:period===p.id?T.gold:"transparent",color:period===p.id?"#000":T.silver,border:`1px solid ${period===p.id?T.gold:T.border}`}}>{p.l}</button>
        ))}
      </div>

      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        <div style={{background:T.card,border:`1px solid ${T.green}44`,borderRadius:7,padding:"13px 14px",gridColumn:"1/-1"}}>
          <Lbl style={{marginBottom:4,color:T.green}}>{L.confirmedRev}</Lbl>
          <div style={{fontSize:"2rem",color:T.green,fontWeight:700,lineHeight:1}}>€{totalConfirmed}</div>
          <div style={{fontSize:"0.68rem",color:T.silver,marginTop:4}}>{confirmed.length} {L.paidConfirmedCount}</div>
        </div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:"12px 13px"}}>
          <Lbl style={{marginBottom:3,color:T.red}}>{L.pendingPayment}</Lbl>
          <div style={{fontSize:"1.4rem",color:T.red,fontWeight:700,lineHeight:1}}>€{totalPending}</div>
          <div style={{fontSize:"0.64rem",color:T.silver,marginTop:3}}>{pending.length} {L.unconfirmedCount}</div>
        </div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:"12px 13px"}}>
          <Lbl style={{marginBottom:3}}>{L.scheduledLabel}</Lbl>
          <div style={{fontSize:"1.4rem",color:T.gold,fontWeight:700,lineHeight:1}}>€{totalScheduled}</div>
          <div style={{fontSize:"0.64rem",color:T.silver,marginTop:3}}>{scheduled.length} {L.futureCount}</div>
        </div>
      </div>

      {/* Print buttons */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <Btn variant="ghost" style={{flex:1,padding:"8px 6px",fontSize:"0.58rem"}} onClick={()=>setPrintModal("today")}>🖨 {L.printToday}</Btn>
        <Btn variant="ghost" style={{flex:1,padding:"8px 6px",fontSize:"0.58rem"}} onClick={()=>setPrintModal("month")}>🖨 {L.printMonth}</Btn>
      </div>

      {/* Payment method breakdown */}
      {byMethod.length>0&&(<>
        <Lbl style={{marginBottom:9}}>{L.byMethod}</Lbl>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:"13px",marginBottom:16}}>
          {byMethod.map(([m,v])=>{const pct=Math.round((v/totalConfirmed)*100);return(
            <div key={m} style={{marginBottom:9}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:"0.84rem",color:T.light}}>{m}</span><span style={{fontSize:"0.8rem",color:T.gold}}>€{v} <span style={{color:T.silver,fontSize:"0.7rem"}}>({pct}%)</span></span></div>
              <div style={{height:5,background:T.muted,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:T.gold,borderRadius:3,width:`${pct}%`}}/></div>
            </div>
          );})}
        </div>
      </>)}

      {/* 7-day chart */}
      <Lbl style={{marginBottom:9}}>{L.last7}</Lbl>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:"14px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:90}}>
          {chartDays.map(d=>(
            <div key={d.str} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:"0.6rem",color:d.rev>0?T.green:T.silver,fontFamily:"'Josefin Sans',sans-serif",fontWeight:700}}>{d.rev>0?`€${d.rev}`:""}</div>
              <div style={{flex:1,width:"100%",display:"flex",alignItems:"flex-end"}}>
                <div style={{width:"100%",background:d.str===TODAY?T.green:T.greenLo,borderRadius:"3px 3px 0 0",height:`${Math.max((d.rev/maxRev)*100,2)}%`,minHeight:d.rev>0?8:2,border:d.str===TODAY?`1px solid ${T.green}`:`1px solid ${T.green}44`}}/>
              </div>
              <div style={{fontSize:"0.54rem",color:d.str===TODAY?T.green:T.silver,fontFamily:"'Josefin Sans',sans-serif"}}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Service breakdown */}
      {svcBreakdown.length>0&&(<>
        <Lbl style={{marginBottom:9}}>{L.byService}</Lbl>
        {svcBreakdown.map(s=>(
          <div key={s.name} style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:"0.84rem",color:T.light}}>{s.name}</span><span style={{fontSize:"0.78rem",color:T.gold}}>€{s.total} · {s.count}×</span></div>
            <div style={{height:5,background:T.muted,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:T.gold,borderRadius:3,width:`${(s.total/maxSvc)*100}%`}}/></div>
          </div>
        ))}
      </>)}

      {/* Full register */}
      <div style={{marginTop:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <Lbl style={{margin:0}}>{L.records} — {PERIODS.find(p=>p.id===period)?.l}</Lbl>
          <span style={{fontSize:"0.66rem",color:T.silver,fontFamily:"'Josefin Sans',sans-serif"}}>{periodBk.length} {L.total}</span>
        </div>

        {confirmed.length>0&&(<div style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><div style={{width:7,height:7,borderRadius:"50%",background:T.green}}/><Lbl style={{margin:0,color:T.green}}>{L.paidAndConfirmed} ({confirmed.length})</Lbl></div>
          {confirmed.sort((a,b)=>b.date.localeCompare(a.date)).map(b=>(
            <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",marginBottom:5,background:T.card,border:`1px solid ${T.green}33`,borderRadius:5}}>
              <div style={{minWidth:0}}><div style={{fontSize:"0.86rem",color:T.white,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div><div style={{fontSize:"0.66rem",color:T.silver,marginTop:2}}>{svcName(svc(b.serviceId),lang)} · {dateLabel(b.date)} {b.time}h</div></div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}><div style={{fontSize:"0.88rem",color:T.green,fontWeight:700}}>€{svc(b.serviceId)?.price}</div><div style={{fontSize:"0.58rem",color:T.silver,marginTop:2,fontFamily:"'Josefin Sans',sans-serif"}}>{b.payMethod}</div></div>
            </div>
          ))}
        </div>)}

        {pending.length>0&&(<div style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><div style={{width:7,height:7,borderRadius:"50%",background:T.red}}/><Lbl style={{margin:0,color:T.red}}>{L.serviceDonePaymentPending} ({pending.length})</Lbl></div>
          {pending.map(b=>(
            <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",marginBottom:5,background:T.redLo,border:`1px solid ${T.red}44`,borderRadius:5}}>
              <div style={{minWidth:0}}><div style={{fontSize:"0.86rem",color:T.white,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div><div style={{fontSize:"0.66rem",color:T.silver,marginTop:2}}>{svcName(svc(b.serviceId),lang)} · {dateLabel(b.date)} {b.time}h</div></div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}><div style={{fontSize:"0.88rem",color:T.red,fontWeight:700}}>€{svc(b.serviceId)?.price}</div><button onClick={()=>setConfirmModal(b)} style={{marginTop:4,padding:"3px 9px",background:T.gold,color:"#000",border:"none",borderRadius:3,cursor:"pointer",fontSize:"0.56rem",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",fontWeight:700}}>{L.toConfirm}</button></div>
            </div>
          ))}
        </div>)}

        {scheduled.length>0&&(<div style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><div style={{width:7,height:7,borderRadius:"50%",background:T.gold}}/><Lbl style={{margin:0}}>{L.scheduledCount} ({scheduled.length})</Lbl></div>
          {scheduled.sort((a,b)=>a.date.localeCompare(b.date)).map(b=>(
            <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",marginBottom:5,background:T.card,border:`1px solid ${T.border}`,borderRadius:5,opacity:0.7}}>
              <div style={{minWidth:0}}><div style={{fontSize:"0.84rem",color:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div><div style={{fontSize:"0.64rem",color:T.silver,marginTop:2}}>{svcName(svc(b.serviceId),lang)} · {dateLabel(b.date)} {b.time}h</div></div>
              <div style={{fontSize:"0.86rem",color:T.gold,flexShrink:0,marginLeft:10}}>€{svc(b.serviceId)?.price}</div>
            </div>
          ))}
        </div>)}

        {cancelled.length>0&&(<div style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><div style={{width:7,height:7,borderRadius:"50%",background:T.silver}}/><Lbl style={{margin:0}}>{L.cancelled} ({cancelled.length})</Lbl></div>
          {cancelled.map(b=>(
            <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",marginBottom:5,background:T.card,border:`1px solid ${T.border}`,borderRadius:5,opacity:0.45}}>
              <div><div style={{fontSize:"0.82rem",color:T.mid,textDecoration:"line-through"}}>{b.name}</div><div style={{fontSize:"0.64rem",color:T.silver}}>{svcName(svc(b.serviceId),lang)} · {dateLabel(b.date)} {b.time}h</div></div>
              <div style={{fontSize:"0.8rem",color:T.silver,textDecoration:"line-through",flexShrink:0,marginLeft:10}}>€{svc(b.serviceId)?.price}</div>
            </div>
          ))}
        </div>)}

        {periodBk.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:T.silver,fontSize:"0.86rem"}}>{L.noRecordsPeriod}</div>}
      </div>

      {confirmModal&&<ConfirmPayModal booking={confirmModal} svc={svc} onConfirm={confirmPayment} onClose={()=>setConfirmModal(null)} lang={lang}/>}
      {printModal&&<PrintReport bookings={printBk(printModal)} label={printModal==="today"?L.today:LANGS[lang].months[NOW.getMonth()]} barberName={barber.name} svc={svc} onClose={()=>setPrintModal(null)} lang={lang}/>}
    </div>
  );
}

function BSchedule({barber,setBarbers,lang}){
  const L=LANGS[lang].t;
  const [f,setF]=useState({...barber.schedule});
  const toggleDay=d=>setF(p=>({...p,workDays:p.workDays.includes(d)?p.workDays.filter(x=>x!==d):[...p.workDays,d].sort()}));
  const save=()=>setBarbers(p=>p.map(b=>b.id===barber.id?{...b,schedule:f}:b));
  return(
    <div style={{padding:"0 20px"}}>
      <Lbl style={{marginBottom:10}}>{L.workDays}</Lbl>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        {LANGS[lang].wdaysF.map((d,i)=>{const on=f.workDays.includes(i);return(<button key={i} onClick={()=>toggleDay(i)} style={{padding:"7px 11px",borderRadius:4,cursor:"pointer",fontSize:"0.66rem",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",background:on?T.goldLo:"transparent",color:on?T.gold:T.silver,border:`1px solid ${on?T.gold:T.border}`}}>{d.slice(0,3)}</button>);})}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        <div><Lbl>{L.startHour}</Lbl><Sel value={f.startHour} onChange={e=>setF(p=>({...p,startHour:e.target.value}))}>{ALL_HOURS.map(h=><option key={h} value={h}>{h}</option>)}</Sel></div>
        <div><Lbl>{L.endHour}</Lbl><Sel value={f.endHour} onChange={e=>setF(p=>({...p,endHour:e.target.value}))}>{ALL_HOURS.map(h=><option key={h} value={h}>{h}</option>)}</Sel></div>
      </div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:"12px 13px",marginBottom:16}}>
        <Lbl style={{marginBottom:7}}>{L.generatedSlots}</Lbl>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{getBarberHours({schedule:f}).map(h=><span key={h} style={{fontSize:"0.7rem",color:T.mid,padding:"3px 7px",background:T.muted,borderRadius:3,fontFamily:"'Josefin Sans',sans-serif"}}>{h}</span>)}</div>
      </div>
      <Btn variant="gold" style={{width:"100%"}} onClick={save}>{L.saveSchedule}</Btn>
    </div>
  );
}

function BProfile({barber,setBarbers,shopId,onLogout,lang}){
  const L=LANGS[lang].t;
  const [edit,setEdit]=useState(false);
  const [f,setF]=useState({...barber});
  const [photoBusy,setPhotoBusy]=useState(false);
  const [photoErr,setPhotoErr]=useState("");
  const u=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{if(f.pinNew){f.pin=f.pinNew;delete f.pinNew;}setBarbers(p=>p.map(b=>b.id===barber.id?f:b));setEdit(false);};
  const uploadPhoto=async(file)=>{
    if(!file||!shopId)return;
    if(file.size>5*1024*1024){setPhotoErr("A imagem é demasiado grande (máx. 5MB).");return;}
    setPhotoBusy(true);setPhotoErr("");
    const ext=file.name.split(".").pop();
    const path=`${shopId}/barbeiro-${barber.id}-${Date.now()}.${ext}`;
    const{error}=await supabase.storage.from("salon-photos").upload(path,file,{upsert:true});
    if(error){setPhotoBusy(false);setPhotoErr("Não foi possível enviar a imagem.");return;}
    const{data}=supabase.storage.from("salon-photos").getPublicUrl(path);
    setBarbers(p=>p.map(b=>b.id===barber.id?{...b,photoUrl:data.publicUrl}:b));
    setF(p=>({...p,photoUrl:data.publicUrl}));
    setPhotoBusy(false);
  };
  return(
    <div style={{padding:"0 20px"}}>
      <div style={{textAlign:"center",marginBottom:22}}>
        <Avatar barber={barber} size={62}/>
        <div style={{fontSize:"1.15rem",color:T.white,fontWeight:600,marginTop:11}}>{barber.name}</div>
        <div style={{fontSize:"0.7rem",color:T.silver,marginTop:2}}>{barber.role}</div>
        {edit&&(
          <label style={{display:"inline-block",marginTop:10}}>
            <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>uploadPhoto(e.target.files?.[0])}/>
            <div style={{padding:"6px 14px",background:T.card,border:`1px dashed ${T.border}`,borderRadius:6,color:T.silver,fontSize:"0.72rem",cursor:"pointer"}}>
              {photoBusy?"A enviar...":"Trocar foto de perfil"}
            </div>
          </label>
        )}
        {photoErr&&<div style={{color:T.red,fontSize:"0.72rem",marginTop:6}}>{photoErr}</div>}
      </div>
      {!edit?(
        <>
          {[[L.nameLabel,barber.name],[L.role,barber.role],[L.phone,barber.phone],[L.bio,barber.bio]].map(([l,v])=>(
            <div key={l} style={{padding:"9px 0",borderBottom:`1px solid ${T.border}`}}><Lbl style={{marginBottom:3}}>{l}</Lbl><div style={{fontSize:"0.88rem",color:T.light,lineHeight:1.5}}>{v}</div></div>
          ))}
          <div style={{marginTop:16,display:"flex",gap:8}}>
            <Btn variant="ghost" style={{flex:1}} onClick={()=>{setF({...barber});setEdit(true);}}>{L.edit}</Btn>
            <Btn variant="danger" onClick={onLogout}>{L.logout}</Btn>
          </div>
        </>
      ):(
        <>
          {[[L.nameLabel,"name","text"],[L.role,"role","text"],[L.phone,"phone","tel"]].map(([l,k,t])=>(
            <div key={k} style={{marginBottom:11}}><Lbl>{l}</Lbl><Inp type={t} value={f[k]} onChange={u(k)}/></div>
          ))}
          <div style={{marginBottom:11}}><Lbl>{L.bio}</Lbl><Txta rows={2} value={f.bio} onChange={u("bio")}/></div>
          <div style={{marginBottom:14}}><Lbl>{L.newPin}</Lbl><Inp type="password" placeholder={L.keepPin} value={f.pinNew||""} onChange={e=>setF(p=>({...p,pinNew:e.target.value}))}/></div>
          <div style={{display:"flex",gap:8}}><Btn variant="gold" style={{flex:1}} onClick={save}>{L.save}</Btn><Btn variant="ghost" onClick={()=>setEdit(false)}>{L.cancel}</Btn></div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN + CLIENT (simplified but complete)
// ══════════════════════════════════════════════════════════════════════════════
function AdminPanel({bookings,barbers,setBarbers,services,setServices,shop,setShop,shopId,onLogout}){
  const [tab,setTab]=useState("overview");
  const [modal,setModal]=useState(null);
  const [bf,setBf]=useState({});
  const svc=id=>services.find(s=>s.id===id);
  const totalRev=bookings.filter(b=>b.paid).reduce((s,b)=>s+(svc(b.serviceId)?.price||0),0);
  const todayAll=bookings.filter(b=>b.date===TODAY&&!b.blocked);
  const openAddBarber=()=>{setBf({id:null,name:"",role:"Barbeiro",pin:"",phone:"",bio:"",avatar:"",color:T.gold,schedule:{workDays:[1,2,3,4,5],startHour:"09:00",endHour:"18:00"},active:true});setModal("barber");};
  const saveBarber=()=>{if(!bf.name.trim()||!bf.pin.trim())return;if(bf.id)setBarbers(p=>p.map(b=>b.id===bf.id?bf:b));else setBarbers(p=>[...p,{...bf,id:mkId(),avatar:bf.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}]);setModal(null);};
  const TABS=[{id:"overview",l:"Geral"},{id:"barbers",l:"Barbeiros"},{id:"services",l:"Serviços"},{id:"shop",l:"Barbearia"}];
  const [photoBusy,setPhotoBusy]=useState(false);
  const [photoErr,setPhotoErr]=useState("");
  const uploadPhoto=async(file)=>{
    if(!file||!shopId)return;
    if(file.size>5*1024*1024){setPhotoErr("A imagem é demasiado grande (máx. 5MB).");return;}
    setPhotoBusy(true);setPhotoErr("");
    const ext=file.name.split(".").pop();
    const path=`${shopId}/foto-${Date.now()}.${ext}`;
    const{error}=await supabase.storage.from("salon-photos").upload(path,file,{upsert:true});
    if(error){setPhotoBusy(false);setPhotoErr("Não foi possível enviar a imagem.");return;}
    const{data}=supabase.storage.from("salon-photos").getPublicUrl(path);
    setShop(p=>({...p,photoUrl:data.publicUrl}));
    setPhotoBusy(false);
  };
  const [delOpen,setDelOpen]=useState(false);
  const [delName,setDelName]=useState("");
  const [delPass,setDelPass]=useState("");
  const [delErr,setDelErr]=useState("");
  const [delBusy,setDelBusy]=useState(false);
  const doDeleteShop=async()=>{
    setDelErr("");
    if(delName.trim()!==(shop.name||"").trim()){setDelErr("O nome não corresponde ao nome da barbearia.");return;}
    if(!delPass){setDelErr("Introduz a password para confirmar.");return;}
    setDelBusy(true);
    const{data,error}=await supabase.rpc("delete_owner_shop",{p_shop_id:shopId,p_password:delPass});
    setDelBusy(false);
    if(error||!data){setDelErr("Password incorreta ou não foi possível apagar.");return;}
    const url=new URL(window.location.href);
    url.searchParams.delete("loja");
    window.location.href=url.toString();
  };
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",color:T.light}}>
      <style>{GS}</style>
      <header style={{width:"100%",maxWidth:520,padding:"14px 20px 0",borderBottom:`1px solid ${T.border}`,background:T.surface,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div><div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"0.88rem",letterSpacing:"0.15em",fontWeight:700,color:T.white}}>LC<span style={{color:T.gold}}>.</span>84 <span style={{color:T.silver,fontSize:"0.68rem"}}>Admin</span></div></div>
          <Btn variant="danger" style={{padding:"5px 10px",fontSize:"0.56rem"}} onClick={onLogout}>Sair</Btn>
        </div>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>{TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 14px",background:"none",border:"none",borderBottom:`2px solid ${tab===t.id?T.gold:"transparent"}`,cursor:"pointer",color:tab===t.id?T.gold:T.silver,fontSize:"0.6rem",letterSpacing:"0.16em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",fontWeight:tab===t.id?700:400,whiteSpace:"nowrap"}}>{t.l}</button>)}</div>
      </header>
      <main style={{width:"100%",maxWidth:520,flex:1,padding:"18px 20px 60px"}}>
        {tab==="overview"&&(<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
            {[{l:"Total Faturado",v:`€${totalRev}`,c:T.gold},{l:"Barbeiros",v:barbers.filter(b=>b.active).length,c:T.white},{l:"Hoje (todos)",v:todayAll.length,c:T.mid},{l:"Total Marcações",v:bookings.filter(b=>!b.blocked).length,c:T.mid}].map(s=>(
              <div key={s.l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:"12px 13px"}}><Lbl style={{marginBottom:4}}>{s.l}</Lbl><div style={{fontSize:"1.45rem",color:s.c,fontWeight:600}}>{s.v}</div></div>
            ))}
          </div>
          <Lbl style={{marginBottom:10}}>Equipa hoje</Lbl>
          {barbers.filter(b=>b.active).map(b=>{const bBk=bookings.filter(bk=>bk.barberId===b.id&&bk.date===TODAY&&!bk.blocked);const rev=bBk.filter(bk=>bk.paid).reduce((s,bk)=>s+(svc(bk.serviceId)?.price||0),0);return(
            <div key={b.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",marginBottom:6,background:T.card,border:`1px solid ${T.border}`,borderRadius:6}}>
              <Avatar barber={b} size={36}/><div style={{flex:1}}><div style={{fontSize:"0.92rem",color:T.white,fontWeight:500}}>{b.name}</div><div style={{fontSize:"0.68rem",color:T.silver}}>{bBk.length} marcações hoje</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:"0.92rem",color:T.gold,fontWeight:600}}>€{rev}</div></div>
            </div>
          );})}
        </>)}
        {tab==="barbers"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><Lbl style={{margin:0}}>{barbers.length} barbeiros</Lbl><Btn variant="gold" style={{padding:"6px 13px"}} onClick={openAddBarber}>+ Novo</Btn></div>
          {barbers.map(b=>(
            <div key={b.id} style={{display:"flex",alignItems:"center",gap:11,padding:"12px 13px",marginBottom:7,background:T.card,border:`1px solid ${T.border}`,borderRadius:6,opacity:b.active?1:0.45}}>
              <Avatar barber={b} size={36}/>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:"0.92rem",color:T.white,fontWeight:500}}>{b.name}</div><div style={{fontSize:"0.68rem",color:T.silver}}>{b.role} · PIN: {b.pin}</div></div>
              <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                <button onClick={()=>setBarbers(p=>p.map(bb=>bb.id===b.id?{...bb,active:!bb.active}:bb))} style={{background:b.active?T.greenLo:T.muted,border:`1px solid ${b.active?T.green:T.border}`,borderRadius:10,padding:"2px 8px",color:b.active?T.green:T.silver,fontSize:"0.54rem",cursor:"pointer",fontFamily:"'Josefin Sans',sans-serif"}}>{b.active?"Ativo":"Off"}</button>
                <button onClick={()=>{setBf({...b});setModal("barber");}} style={{background:"none",border:"none",color:T.silver,cursor:"pointer",fontSize:"0.82rem"}}>✏</button>
              </div>
            </div>
          ))}
          {modal==="barber"&&<Modal onClose={()=>setModal(null)} title={bf.id?"Editar Barbeiro":"Novo Barbeiro"}>
            {[["Nome","name","text"],["Função","role","text"],["Telemóvel","phone","tel"],["PIN","pin","text"]].map(([l,k,t])=>(
              <div key={k} style={{marginBottom:10}}><Lbl>{l}</Lbl><Inp type={t} value={bf[k]||""} onChange={e=>setBf(p=>({...p,[k]:e.target.value}))}/></div>
            ))}
            <div style={{marginBottom:10}}><Lbl>Bio</Lbl><Txta rows={2} value={bf.bio||""} onChange={e=>setBf(p=>({...p,bio:e.target.value}))}/></div>
            <Lbl style={{marginBottom:7}}>Cor</Lbl>
            <div style={{display:"flex",gap:8,marginBottom:12}}>{["#b8955a","#6a9eb8","#9e6a4a","#7a9e6a","#9a6a9e","#9e4a4a"].map(c=><div key={c} onClick={()=>setBf(p=>({...p,color:c}))} style={{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",border:`2px solid ${bf.color===c?"#fff":"transparent"}`}}/>)}</div>
            <Lbl style={{marginBottom:7}}>Dias de trabalho</Lbl>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:11}}>{WDAYS_F.map((d,i)=>{const on=(bf.schedule?.workDays||[]).includes(i);return(<button key={i} onClick={()=>setBf(p=>({...p,schedule:{...p.schedule,workDays:on?p.schedule.workDays.filter(x=>x!==i):[...(p.schedule?.workDays||[]),i].sort()}}))} style={{padding:"5px 9px",borderRadius:4,cursor:"pointer",fontSize:"0.58rem",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",background:on?T.goldLo:"transparent",color:on?T.gold:T.silver,border:`1px solid ${on?T.gold:T.border}`}}>{d.slice(0,3)}</button>);})}</div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <div style={{flex:1}}><Lbl>Início</Lbl><Sel value={bf.schedule?.startHour||"09:00"} onChange={e=>setBf(p=>({...p,schedule:{...p.schedule,startHour:e.target.value}}))}>{ALL_HOURS.map(h=><option key={h} value={h}>{h}</option>)}</Sel></div>
              <div style={{flex:1}}><Lbl>Fim</Lbl><Sel value={bf.schedule?.endHour||"18:00"} onChange={e=>setBf(p=>({...p,schedule:{...p.schedule,endHour:e.target.value}}))}>{ALL_HOURS.map(h=><option key={h} value={h}>{h}</option>)}</Sel></div>
            </div>
            <div style={{display:"flex",gap:8}}><Btn variant="gold" style={{flex:1}} onClick={saveBarber}>Guardar</Btn>{bf.id&&<Btn variant="danger" onClick={()=>{setBarbers(p=>p.filter(b=>b.id!==bf.id));setModal(null);}}>Eliminar</Btn>}<Btn variant="ghost" onClick={()=>setModal(null)}>Fechar</Btn></div>
          </Modal>}
        </>)}
        {tab==="services"&&(<>
          <ServicesAdmin services={services} setServices={setServices}/>
        </>)}
        {tab==="shop"&&(<>
          <div style={{marginBottom:18}}>
            <Lbl style={{marginBottom:8}}>Foto da barbearia</Lbl>
            {shop.photoUrl&&(
              <img src={shop.photoUrl} style={{width:"100%",height:150,objectFit:"cover",borderRadius:6,marginBottom:10,border:`1px solid ${T.border}`}}/>
            )}
            <label style={{display:"block"}}>
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>uploadPhoto(e.target.files?.[0])}/>
              <div style={{padding:"10px",textAlign:"center",background:T.card,border:`1px dashed ${T.border}`,borderRadius:6,color:T.silver,fontSize:"0.78rem",cursor:"pointer"}}>
                {photoBusy?"A enviar...":shop.photoUrl?"Trocar foto":"Escolher foto"}
              </div>
            </label>
            {photoErr&&<div style={{color:T.red,fontSize:"0.74rem",marginTop:6}}>{photoErr}</div>}
          </div>
          {[["Nome","name","text"],["Morada","address","text"],["Telemóvel","phone","tel"],["PIN Admin","adminPin","text"]].map(([l,k,t])=>(
            <div key={k} style={{marginBottom:11}}><Lbl>{l}</Lbl><Inp type={t} value={shop[k]||""} onChange={e=>setShop(p=>({...p,[k]:e.target.value}))}/></div>
          ))}
          <div style={{marginBottom:14}}><Lbl>Bio</Lbl><Txta rows={3} value={shop.bio||""} onChange={e=>setShop(p=>({...p,bio:e.target.value}))}/></div>
          <Btn variant="gold" style={{width:"100%"}}>Guardar</Btn>

          <div style={{marginTop:32,paddingTop:18,borderTop:`1px solid ${T.border}`}}>
            <Lbl style={{marginBottom:8,color:T.red}}>Zona de perigo</Lbl>
            <div style={{fontSize:"0.72rem",color:T.silver,marginBottom:10,lineHeight:1.5}}>
              Apagar a barbearia remove definitivamente todos os dados (marcações, barbeiros, serviços). Esta ação não pode ser desfeita.
            </div>
            <Btn variant="danger" style={{width:"100%"}} onClick={()=>{setDelOpen(true);setDelName("");setDelPass("");setDelErr("");}}>Apagar barbearia</Btn>
          </div>

          {delOpen&&(
            <Modal onClose={()=>setDelOpen(false)} title="Apagar barbearia">
              <div style={{fontSize:"0.76rem",color:T.silver,marginBottom:14,lineHeight:1.5}}>
                Esta ação é permanente. Para confirmar, escreve o nome exato da barbearia (<b style={{color:T.white}}>{shop.name}</b>) e a tua password.
              </div>
              <div style={{marginBottom:10}}><Lbl>Nome da barbearia</Lbl><Inp value={delName} onChange={e=>setDelName(e.target.value)}/></div>
              <div style={{marginBottom:10}}><Lbl>Password</Lbl><Inp type="password" value={delPass} onChange={e=>setDelPass(e.target.value)}/></div>
              {delErr&&<div style={{color:T.red,fontSize:"0.72rem",marginBottom:10}}>{delErr}</div>}
              <div style={{display:"flex",gap:8}}>
                <Btn variant="danger" style={{flex:1}} onClick={doDeleteShop} disabled={delBusy}>{delBusy?"A apagar...":"Apagar definitivamente"}</Btn>
                <Btn variant="ghost" onClick={()=>setDelOpen(false)}>Cancelar</Btn>
              </div>
            </Modal>
          )}
        </>)}
      </main>
    </div>
  );
}

function ServicesAdmin({services,setServices}){
  const [modal,setModal]=useState(false);const [f,setF]=useState({});
  const openAdd=()=>{setF({id:null,name:"",duration:30,price:0,active:true});setModal(true);};
  const openEdit=s=>{setF({...s});setModal(true);};
  const save=()=>{if(!f.name.trim())return;if(f.id)setServices(p=>p.map(s=>s.id===f.id?f:s));else setServices(p=>[...p,{...f,id:mkId()}]);setModal(false);};
  return(<>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><Lbl style={{margin:0}}>{services.length} serviços</Lbl><Btn variant="gold" style={{padding:"6px 13px"}} onClick={openAdd}>+ Novo</Btn></div>
    {services.map(s=>(
      <div key={s.id} style={{display:"flex",alignItems:"center",gap:9,padding:"11px 13px",marginBottom:6,background:T.card,border:`1px solid ${T.border}`,borderRadius:6,opacity:s.active?1:0.45}}>
        <div style={{flex:1}}><div style={{fontSize:"0.95rem",color:T.white,fontWeight:500}}>{s.name}</div><div style={{fontSize:"0.68rem",color:T.silver}}>{s.duration} min</div></div>
        <div style={{fontSize:"0.95rem",color:T.gold,fontWeight:600}}>€{s.price}</div>
        <button onClick={()=>setServices(p=>p.map(sv=>sv.id===s.id?{...sv,active:!sv.active}:sv))} style={{background:s.active?T.greenLo:T.muted,border:`1px solid ${s.active?T.green:T.border}`,borderRadius:10,padding:"2px 8px",color:s.active?T.green:T.silver,fontSize:"0.54rem",cursor:"pointer",fontFamily:"'Josefin Sans',sans-serif"}}>{s.active?"Ativo":"Off"}</button>
        <button onClick={()=>openEdit(s)} style={{background:"none",border:"none",color:T.silver,cursor:"pointer",fontSize:"0.82rem"}}>✏</button>
      </div>
    ))}
    {modal&&<Modal onClose={()=>setModal(false)} title={f.id?"Editar Serviço":"Novo Serviço"}>
      <div style={{marginBottom:11}}><Lbl>Nome</Lbl><Inp value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        <div><Lbl>Duração (min)</Lbl><Inp type="number" value={f.duration} onChange={e=>setF(p=>({...p,duration:Number(e.target.value)}))}/></div>
        <div><Lbl>Preço (€)</Lbl><Inp type="number" value={f.price} onChange={e=>setF(p=>({...p,price:Number(e.target.value)}))}/></div>
      </div>
      <div style={{display:"flex",gap:8}}><Btn variant="gold" style={{flex:1}} onClick={save}>Guardar</Btn>{f.id&&<Btn variant="danger" onClick={()=>{setServices(p=>p.filter(s=>s.id!==f.id));setModal(false);}}>Eliminar</Btn>}<Btn variant="ghost" onClick={()=>setModal(false)}>Fechar</Btn></div>
    </Modal>}
  </>);
}

function BookingCalendarStep({sel,setSel,barber,bookings,freeSlots,worksOnDate,onNext,onBack,lang}){
  const L=LANGS[lang].t;
  const [calY,setCalY]=useState(NOW.getFullYear());
  const [calM,setCalM]=useState(NOW.getMonth());
  const dim=new Date(calY,calM+1,0).getDate();
  const fd=new Date(calY,calM,1).getDay();
  const prevM=()=>{if(calM===0){setCalM(11);setCalY(y=>y-1);}else setCalM(m=>m-1);};
  const nextM=()=>{if(calM===11){setCalM(0);setCalY(y=>y+1);}else setCalM(m=>m+1);};
  const isDayBlocked=ds=>{
    const hours=barber?getBarberHours(barber):[];
    const dayBks=bookings.filter(b=>b.barberId===sel.barberId&&b.date===ds&&!b.blocked);
    const free=hours.filter(h=>!dayBks.find(b=>b.time===h));
    return free.length===0&&hours.length>0;
  };
  return(<>
    <Lbl style={{marginBottom:10}}>{L.chooseDate}</Lbl>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <button onClick={prevM} disabled={calY===NOW.getFullYear()&&calM===NOW.getMonth()} style={{background:"none",border:`1px solid ${T.border}`,color:T.mid,width:32,height:32,borderRadius:4,cursor:"pointer",fontSize:"1rem",opacity:calY===NOW.getFullYear()&&calM===NOW.getMonth()?0.3:1}}>‹</button>
      <span style={{fontSize:"0.95rem",color:T.white,letterSpacing:"0.06em"}}>{LANGS[lang].months[calM]} {calY}</span>
      <button onClick={nextM} style={{background:"none",border:`1px solid ${T.border}`,color:T.mid,width:32,height:32,borderRadius:4,cursor:"pointer",fontSize:"1rem"}}>›</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
      {LANGS[lang].wdays.map(d=><div key={d} style={{textAlign:"center",fontSize:"0.58rem",color:T.silver,padding:"2px 0",fontFamily:"'Josefin Sans',sans-serif"}}>{d}</div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:16}}>
      {Array(fd).fill(null).map((_,i)=><div key={"e"+i}/>)}
      {Array(dim).fill(null).map((_,i)=>{
        const day=i+1;
        const ds=`${calY}-${String(calM+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const isPast=ds<TODAY;
        const isSelected=ds===sel.date;
        const isFolga=barber&&!barberWorksOnDate(barber,ds);
        const isFullyBooked=!isPast&&!isFolga&&isDayBlocked(ds);
        const isToday=ds===TODAY;
        let bg="transparent", color=T.light, border=`1px solid ${T.border}`, cursor="pointer", opacity=1;
        if(isPast){color=T.muted;border=`1px solid ${T.border}`;cursor="default";opacity=0.4;}
        else if(isFolga){bg=T.redLo;color=T.red;border=`1px solid ${T.red}44`;cursor="not-allowed";opacity=0.6;}
        else if(isFullyBooked){bg=T.muted;color=T.silver;cursor="not-allowed";}
        else if(isSelected){bg=T.gold;color="#000";border=`1px solid ${T.gold}`;}
        else if(isToday){bg=T.goldLo;color=T.gold;border=`1px solid ${T.gold}66`;}
        return(
          <div key={day} onClick={()=>!isPast&&!isFolga&&!isFullyBooked&&setSel(p=>({...p,date:ds,time:""}))} style={{aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:5,cursor,background:bg,border,color,fontSize:"0.82rem",opacity,position:"relative"}}>
            {day}
            {!isPast&&!isFolga&&!isFullyBooked&&!isSelected&&(()=>{
              const hours=barber?getBarberHours(barber):[];
              const dayBks=bookings.filter(b=>b.barberId===sel.barberId&&b.date===ds&&!b.blocked);
              const free=hours.filter(h=>!dayBks.find(b=>b.time===h)).length;
              if(free>0)return<div style={{width:4,height:4,borderRadius:"50%",background:T.green,position:"absolute",bottom:3}}/>;
            })()}
          </div>
        );
      })}
    </div>
    <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
      {[[T.green,L.confirmed],[T.gold,L.selected],[T.silver,L.blocked],[T.red,L.holiday]].map(([c,l])=>(
        <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
          <span style={{fontSize:"0.62rem",color:T.silver,fontFamily:"'Josefin Sans',sans-serif"}}>{l}</span>
        </div>
      ))}
    </div>
    {sel.date&&worksOnDate&&(<>
      <Lbl style={{marginBottom:8}}>{L.freeSlots} — {dateLabel(sel.date,lang)}</Lbl>
      {freeSlots.length===0
        ?<div style={{color:T.silver,fontSize:"0.83rem",padding:"8px 0",marginBottom:12}}>{L.noBookings}</div>
        :<div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
          {freeSlots.map(h=><button key={h} onClick={()=>setSel(p=>({...p,time:h}))} style={{padding:"8px 12px",borderRadius:4,cursor:"pointer",fontSize:"0.78rem",fontFamily:"'Josefin Sans',sans-serif",background:sel.time===h?T.gold:"transparent",color:sel.time===h?"#000":T.mid,border:`1px solid ${sel.time===h?T.gold:T.border}`}}>{h}</button>)}
        </div>
      }
    </>)}
    {sel.date&&!worksOnDate&&<div style={{background:T.redLo,border:`1px solid ${T.red}`,borderRadius:6,padding:"9px 13px",marginBottom:12,fontSize:"0.8rem",color:T.red}}>{barber?.name} — {L.holiday}</div>}
    <Btn variant="gold" style={{width:"100%",marginTop:4}} onClick={onNext}>{L.next}</Btn>
    <Btn variant="ghost" style={{width:"100%",marginTop:7}} onClick={onBack}>{L.back}</Btn>
  </>);
}
function ClientArea({bookings,setBookings,services,barbers,shop,addNotification,lang,onBack}){
  const L=LANGS[lang].t;
  const [screen,setScreen]=useState("home");
  const [step,setStep]=useState(1);
  const [sel,setSel]=useState({barberId:"",serviceId:"",date:"",time:"",name:"",phone:""});
  const [done,setDone]=useState(null);
  const [clientPhone,setClientPhone]=useState("");
  const [myBk,setMyBk]=useState([]);
  const svc=id=>services.find(s=>s.id===id);
  const barber=barbers.find(b=>b.id===sel.barberId);
  const selSvc=svc(sel.serviceId);
  const hours=barber?getBarberHours(barber):[];
  const dayBk=sel.date&&sel.barberId?bookings.filter(b=>b.barberId===sel.barberId&&b.date===sel.date):[];
  const freeSlots=hours.filter(h=>!dayBk.find(b=>b.time===h));
  const worksOnDate=barber&&sel.date?barberWorksOnDate(barber,sel.date):true;
  const confirm=()=>{
    const b={id:mkId(),barberId:sel.barberId,date:sel.date,time:sel.time,serviceId:sel.serviceId,name:sel.name,phone:sel.phone,status:"confirmado",paid:false,payMethod:"",notes:"",blocked:false};
    setBookings(p=>[...p,b]);setMyBk(p=>[...p,b]);setDone(b);
    addNotification(sel.barberId,"new","Nova marcação",`${sel.name} marcou ${svcName(selSvc,lang)} para ${dateLabel(sel.date)} às ${sel.time}h.`);
    setScreen("success");
  };
  const cancel=id=>{
    const b=bookings.find(b=>b.id===id);
    setBookings(p=>p.map(b=>b.id===id?{...b,status:"cancelado"}:b));
    setMyBk(p=>p.map(b=>b.id===id?{...b,status:"cancelado"}:b));
    if(b)addNotification(b.barberId,"cancel","Marcação cancelada",`${b.name} cancelou — ${dateLabel(b.date)} às ${b.time}h.`);
  };
  const lookup=()=>{if(clientPhone.trim().length<5)return;setMyBk(bookings.filter(b=>b.phone===clientPhone.trim()));setScreen("mybookings");};
  const reset=()=>{setSel({barberId:"",serviceId:"",date:"",time:"",name:"",phone:""});setStep(1);setDone(null);setScreen("home");};
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",color:T.light}}>
      <style>{GS}</style>
      <header style={{width:"100%",maxWidth:520,padding:"14px 20px",borderBottom:`1px solid ${T.border}`,background:T.surface,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={T.gold}><path d="M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM21 4.5 19.5 3 9.5 9.5 7.4 11A3 3 0 1 0 9 12.72L11.1 11.4 14 13l.5-1.1L12 10.4 20 4.5zm-15 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
          <div><div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"0.85rem",letterSpacing:"0.15em",fontWeight:700,color:T.white}}>LC<span style={{color:T.gold}}>.</span>84</div><div style={{fontSize:"0.48rem",letterSpacing:"0.28em",color:T.silver,textTransform:"uppercase"}}>{L.clientArea}</div></div>
        </div>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${T.border}`,color:T.silver,padding:"5px 9px",borderRadius:4,cursor:"pointer",fontSize:"0.56rem",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>{L.back}</button>
      </header>
      <main style={{width:"100%",maxWidth:520,flex:1,padding:"20px 20px 80px"}}>
        {screen==="home"&&(<>
          <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:"1.4rem",color:T.white,fontWeight:600,marginBottom:4}}>{shop.name}</div><div style={{fontSize:"0.78rem",color:T.gold}}>{shop.phone}</div></div>
          <Btn variant="gold" style={{width:"100%",marginBottom:10,padding:"14px"}} onClick={()=>setScreen("book")}>⚔ {L.bookCta}</Btn>
          <div style={{marginBottom:16}}><Lbl style={{marginBottom:7}}>{L.myBookingsLabel}</Lbl><div style={{display:"flex",gap:8}}><Inp placeholder={L.phonePlaceholder} value={clientPhone} onChange={e=>setClientPhone(e.target.value)} style={{flex:1}}/><Btn variant="ghost" style={{padding:"10px 13px"}} onClick={lookup}>{L.show}</Btn></div></div>
          <Lbl style={{marginBottom:9}}>{L.ourTeam}</Lbl>
          {barbers.filter(b=>b.active).map(b=>(
            <div key={b.id} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 13px",marginBottom:6,background:T.card,border:`1px solid ${T.border}`,borderRadius:6}}>
              <Avatar barber={b} size={38}/>
              <div style={{flex:1}}><div style={{fontSize:"0.92rem",color:T.white,fontWeight:500}}>{b.name}</div><div style={{fontSize:"0.68rem",color:T.silver}}>{b.role}</div><div style={{fontSize:"0.6rem",color:b.color,marginTop:2,fontFamily:"'Josefin Sans',sans-serif"}}>{LANGS[lang].wdaysF.filter((_,i)=>b.schedule.workDays.includes(i)).map(d=>d.slice(0,3)).join(" · ")} · {b.schedule.startHour}–{b.schedule.endHour}</div></div>
            </div>
          ))}
        </>)}
        {screen==="book"&&(<>
          <div style={{display:"flex",gap:5,marginBottom:20}}>{[1,2,3,4].map(s=><div key={s} style={{flex:1,height:3,borderRadius:2,background:s<=step?T.gold:T.border,transition:"background .3s"}}/>)}</div>
          {step===1&&(<>
            <Lbl style={{marginBottom:10}}>{L.chooseBarber}</Lbl>
            {barbers.filter(b=>b.active).map(b=>(
              <div key={b.id} onClick={()=>setSel(p=>({...p,barberId:b.id,time:""}))} style={{display:"flex",alignItems:"center",gap:11,padding:"13px",marginBottom:7,background:sel.barberId===b.id?T.goldLo:T.card,border:`1px solid ${sel.barberId===b.id?T.gold:T.border}`,borderRadius:6,cursor:"pointer"}}>
                <Avatar barber={b} size={42}/><div><div style={{fontSize:"0.97rem",color:T.white,fontWeight:500}}>{b.name}</div><div style={{fontSize:"0.7rem",color:T.silver}}>{b.role}</div><div style={{fontSize:"0.6rem",color:b.color,marginTop:2,fontFamily:"'Josefin Sans',sans-serif"}}>{LANGS[lang].wdaysF.filter((_,i)=>b.schedule.workDays.includes(i)).map(d=>d.slice(0,3)).join(" · ")}</div></div>
              </div>
            ))}
            <Btn variant="gold" style={{width:"100%",marginTop:7}} onClick={()=>sel.barberId&&setStep(2)}>{L.next}</Btn>
            <Btn variant="ghost" style={{width:"100%",marginTop:7}} onClick={()=>setScreen("home")}>{L.back}</Btn>
          </>)}
          {step===2&&(<>
            <Lbl style={{marginBottom:10}}>{L.chooseService}</Lbl>
            {services.filter(s=>s.active).map(s=>(
              <div key={s.id} onClick={()=>setSel(p=>({...p,serviceId:s.id}))} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",marginBottom:6,background:sel.serviceId===s.id?T.goldLo:T.card,border:`1px solid ${sel.serviceId===s.id?T.gold:T.border}`,borderRadius:6,cursor:"pointer"}}>
                <div><div style={{fontSize:"0.97rem",color:T.white,fontWeight:500}}>{svcName(s,lang)}</div><div style={{fontSize:"0.7rem",color:T.silver,marginTop:2}}>{s.duration} min</div></div>
                <div style={{fontSize:"0.97rem",color:T.gold,fontWeight:600}}>€{s.price}</div>
              </div>
            ))}
            <Btn variant="gold" style={{width:"100%",marginTop:7}} onClick={()=>sel.serviceId&&setStep(3)}>{L.next}</Btn>
            <Btn variant="ghost" style={{width:"100%",marginTop:7}} onClick={()=>setStep(1)}>{L.back}</Btn>
          </>)}
    {step===3&&<BookingCalendarStep sel={sel} setSel={setSel} barber={barber} lang={lang} bookings={bookings} freeSlots={freeSlots} worksOnDate={worksOnDate} onNext={()=>sel.date&&sel.time&&worksOnDate&&setStep(4)} onBack={()=>setStep(2)}/>}
          {step===4&&(<>
            <Lbl style={{marginBottom:10}}>{L.yourData}</Lbl>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,padding:"13px",marginBottom:14}}>
              {[[L.barberLabel,barber?.name],[L.service,svcName(selSvc,lang)],[L.date,dateLabel(sel.date,lang)],[L.time,sel.time],[L.priceLabel,`€${selSvc?.price}`]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}><Lbl style={{marginBottom:0}}>{l}</Lbl><span style={{fontSize:"0.86rem",color:l===L.priceLabel?T.gold:T.white}}>{v}</span></div>
              ))}
            </div>
            <div style={{marginBottom:10}}><Lbl>{L.nameLabel}</Lbl><Inp placeholder={L.namePlaceholder} value={sel.name} onChange={e=>setSel(p=>({...p,name:e.target.value}))}/></div>
            <div style={{marginBottom:16}}><Lbl>{L.phone}</Lbl><Inp placeholder="+351 9XX XXX XXX" value={sel.phone} onChange={e=>setSel(p=>({...p,phone:e.target.value}))}/></div>
            <Btn variant="gold" style={{width:"100%"}} onClick={()=>sel.name.trim()&&sel.phone.trim()&&confirm()}>{L.confirm}</Btn>
            <Btn variant="ghost" style={{width:"100%",marginTop:7}} onClick={()=>setStep(3)}>{L.back}</Btn>
          </>)}
        </>)}
        {screen==="success"&&done&&(<div style={{textAlign:"center",paddingTop:36}}>
          <div style={{width:58,height:58,borderRadius:"50%",background:T.greenLo,border:`2px solid ${T.green}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:"1.3rem",color:T.green}}>✓</div>
          <div style={{fontSize:"1.4rem",color:T.white,fontWeight:600,marginBottom:7}}>{L.bookingConfirmed}</div>
          <div style={{fontSize:"0.86rem",color:T.silver,lineHeight:1.8,marginBottom:24}}>{done.name}<br/><span style={{color:T.gold}}>{barbers.find(b=>b.id===done.barberId)?.name}</span> · {svcName(selSvc,lang)}<br/>{done.time}h · {dateLabel(done.date,lang)}</div>
          <Btn variant="gold" style={{width:"100%",marginBottom:9}} onClick={reset}>{L.newBookingBtn}</Btn>
          <Btn variant="ghost" style={{width:"100%"}} onClick={()=>setScreen("mybookings")}>{L.myBookings}</Btn>
        </div>)}
        {screen==="mybookings"&&(<>
          <Lbl style={{marginBottom:10}}>{myBk.length} {L.bookings}</Lbl>
          {myBk.length===0?<div style={{textAlign:"center",padding:"32px 0",color:T.silver}}>{L.noBookingsFound}</div>
          :myBk.sort((a,b)=>b.date.localeCompare(a.date)).map(b=>(
            <div key={b.id} style={{padding:"11px 13px",marginBottom:6,background:T.card,border:`1px solid ${T.border}`,borderRadius:6}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                <div><div style={{fontSize:"0.92rem",color:T.white,fontWeight:500}}>{svcName(svc(b.serviceId),lang)}</div><div style={{fontSize:"0.68rem",color:T.silver,marginTop:2}}>{barbers.find(br=>br.id===b.barberId)?.name} · {b.time}h · {dateLabel(b.date,lang)}</div></div>
                <Tag status={b.status}/>
              </div>
              {b.status==="confirmado"&&b.date>=TODAY&&<Btn variant="danger" style={{padding:"4px 11px",fontSize:"0.56rem"}} onClick={()=>cancel(b.id)}>{L.cancelBooking}</Btn>}
            </div>
          ))}
          <Btn variant="ghost" style={{width:"100%",marginTop:7}} onClick={()=>setScreen("home")}>{L.back}</Btn>
        </>)}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN + ENTRY
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({barbers,setBarbers,shop,onBarberLogin,onAdminLogin,onBack,lang}){
  const L=LANGS[lang].t;
  const [pin,setPin]=useState(""),[ err,setErr]=useState(false),[show,setShow]=useState(false);
  const [joinMode,setJoinMode]=useState(false);
  const [jName,setJName]=useState(""),[jPin,setJPin]=useState(""),[jPhone,setJPhone]=useState(""),[jErr,setJErr]=useState("");
  const attempt=()=>{if(pin===shop.adminPin){onAdminLogin();return;}const b=barbers.find(b=>b.pin===pin&&b.active);if(b)onBarberLogin(b);else{setErr(true);setPin("");setTimeout(()=>setErr(false),1500);}};
  const join=()=>{
    setJErr("");
    if(!jName.trim()){setJErr("Escreve o teu nome.");return;}
    if(!/^\d{4,6}$/.test(jPin)){setJErr("O código deve ter entre 4 e 6 números.");return;}
    if(jPin===shop.adminPin||barbers.find(b=>b.pin===jPin)){setJErr("Esse código já está a ser usado. Escolhe outro.");return;}
    const nb={id:mkId(),name:jName.trim(),role:"Barbeiro",pin:jPin,phone:jPhone||"",bio:"",avatar:jName.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),color:"#b8955a",schedule:{workDays:[1,2,3,4,5,6],startHour:"09:00",endHour:"19:00"},active:true};
    setBarbers(p=>[...p,nb]);
    onBarberLogin(nb);
  };
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{GS}</style>
      <div style={{width:"100%",maxWidth:290,marginBottom:16}}>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${T.border}`,color:T.silver,padding:"5px 9px",borderRadius:4,cursor:"pointer",fontSize:"0.56rem",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>{L.back}</button>
      </div>
      <div style={{textAlign:"center",marginBottom:40}}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill={T.gold} style={{marginBottom:13}}><path d="M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM21 4.5 19.5 3 9.5 9.5 7.4 11A3 3 0 1 0 9 12.72L11.1 11.4 14 13l.5-1.1L12 10.4 20 4.5zm-15 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
        <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"1.7rem",letterSpacing:"0.12em",fontWeight:700,color:T.white}}>LC<span style={{color:T.gold}}>_</span>84<span style={{color:T.gold,fontSize:"1.25rem"}}>barbervision</span></div>
        <div style={{fontSize:"0.58rem",letterSpacing:"0.38em",color:T.silver,textTransform:"uppercase",marginTop:5}}>{L.barberArea}</div>
      </div>
      {!joinMode?(
        <div style={{width:"100%",maxWidth:290}}>
          <Lbl style={{textAlign:"center",marginBottom:12}}>{L.accessCode}</Lbl>
          <div style={{position:"relative",marginBottom:12}}>
            <Inp type={show?"text":"password"} placeholder="••••" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()} style={{textAlign:"center",fontSize:"1.35rem",letterSpacing:"0.4em",borderColor:err?T.red:T.border}}/>
            <button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.silver,cursor:"pointer",fontSize:"0.7rem"}}>{show?L.hide:L.show}</button>
          </div>
          {err&&<div style={{textAlign:"center",color:T.red,fontSize:"0.76rem",marginBottom:9}}>{L.wrongPin}</div>}
          <Btn variant="gold" style={{width:"100%",marginBottom:13}} onClick={attempt}>{L.enter}</Btn>
          <div style={{textAlign:"center"}}>
            <button onClick={()=>setJoinMode(true)} style={{background:"none",border:"none",color:T.silver,fontSize:"0.72rem",cursor:"pointer",textDecoration:"underline"}}>Sou novo colaborador, quero juntar-me →</button>
          </div>
        </div>
      ):(
        <div style={{width:"100%",maxWidth:290}}>
          <Lbl style={{marginBottom:6}}>O teu nome</Lbl>
          <Inp value={jName} onChange={e=>setJName(e.target.value)} placeholder="Nome completo" style={{marginBottom:12}}/>
          <Lbl style={{marginBottom:6}}>Cria o teu código de acesso (4-6 números)</Lbl>
          <Inp value={jPin} onChange={e=>setJPin(e.target.value.replace(/\D/g,""))} placeholder="••••" style={{marginBottom:12,textAlign:"center",letterSpacing:"0.3em"}}/>
          <Lbl style={{marginBottom:6}}>Telefone (opcional)</Lbl>
          <Inp value={jPhone} onChange={e=>setJPhone(e.target.value)} placeholder="+351 9xx xxx xxx" style={{marginBottom:12}}/>
          {jErr&&<div style={{textAlign:"center",color:T.red,fontSize:"0.76rem",marginBottom:12}}>{jErr}</div>}
          <Btn variant="gold" style={{width:"100%",marginBottom:9}} onClick={join}>Juntar-me à equipa</Btn>
          <div style={{textAlign:"center"}}>
            <button onClick={()=>{setJoinMode(false);setJErr("");}} style={{background:"none",border:"none",color:T.silver,fontSize:"0.72rem",cursor:"pointer",textDecoration:"underline"}}>← Já tenho código de acesso</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EntryScreen({shop,onBarber,onClient,lang,setLang}){
  const L=LANGS[lang].t;
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Cormorant Garamond',Georgia,serif",position:"relative"}}>
      <style>{GS}</style>
      <div style={{position:"absolute",top:16,right:16,display:"flex",gap:6,zIndex:10}}>
        {Object.entries(LANGS).map(([code,l])=>(
          <button key={code} onClick={()=>setLang(code)} style={{padding:"4px 8px",borderRadius:4,cursor:"pointer",fontSize:"1rem",background:lang===code?T.goldLo:"transparent",border:`1px solid ${lang===code?T.gold:T.border}`}} title={l.name}>{l.flag}</button>
        ))}
      </div>
      <div style={{textAlign:"center",marginBottom:40}}>
        {shop.photoUrl&&(
          <img src={shop.photoUrl} style={{width:"100%",maxWidth:290,height:140,objectFit:"cover",borderRadius:10,marginBottom:18,border:`1px solid ${T.border}`}}/>
        )}
        <img src={logoIcon} style={{width:48,height:48,marginBottom:13,objectFit:"contain"}}/>
        <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"1.9rem",letterSpacing:"0.12em",fontWeight:700,color:T.white}}>LC<span style={{color:T.gold}}>_</span>84<span style={{color:T.gold,fontSize:"1.4rem"}}>barbervision</span></div>
        <div style={{fontSize:"0.6rem",letterSpacing:"0.38em",color:T.silver,textTransform:"uppercase",marginTop:5,marginBottom:5}}>{L.platform}</div>
      </div>
      <div style={{width:"100%",maxWidth:290,display:"flex",flexDirection:"column",gap:9}}>
        <button onClick={onClient} style={{padding:"17px",background:T.goldLo,border:`1px solid ${T.gold}`,borderRadius:8,cursor:"pointer",color:T.white,fontFamily:"'Cormorant Garamond',Georgia,serif",textAlign:"center"}}>
          <div style={{fontSize:"1.3rem",marginBottom:5}}>✂</div><div style={{fontSize:"1rem",fontWeight:600,marginBottom:3}}>{L.client}</div><div style={{fontSize:"0.73rem",color:T.silver}}>{L.clientSub}</div>
        </button>
        <button onClick={onBarber} style={{padding:"17px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,cursor:"pointer",color:T.white,fontFamily:"'Cormorant Garamond',Georgia,serif",textAlign:"center"}}>
          <div style={{fontSize:"1.3rem",marginBottom:5}}>◉</div><div style={{fontSize:"1rem",fontWeight:600,marginBottom:3}}>{L.barber}</div><div style={{fontSize:"0.73rem",color:T.silver}}>{L.barberSub}</div>
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION SYSTEM
// ══════════════════════════════════════════════════════════════════════════════

// Trial: 15 days from first open. Demo starts with 3 days left to show urgency.
const TRIAL_START = new Date(Date.now() - 12*24*3600000); // 12 days ago = 3 days left
const TRIAL_DAYS  = 15;
const PRICE_SOLO  = 9.99;
const PRICE_TEAM  = 7.99; // per collaborator

function daysLeft(trialStart){
  const end = new Date(trialStart.getTime() + TRIAL_DAYS*24*3600000);
  return Math.max(0, Math.ceil((end - Date.now()) / 86400000));
}

function TrialBanner({days, onSubscribe}){
  if(days > 5) return null; // only show when close to expiry
  const urgent = days <= 1;
  return(
    <div onClick={onSubscribe} style={{margin:"0 20px 14px",padding:"11px 14px",background:urgent?T.redLo:T.goldLo,border:`1px solid ${urgent?T.red:T.gold}`,borderRadius:7,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{fontSize:"0.82rem",color:urgent?T.red:T.gold,fontWeight:600}}>
          {days===0?"Trial expirado ":"⏳ "}{days===0?"— subscreve para continuar":`${days} dia${days!==1?"s":""} de trial restante${days!==1?"s":""}`}
        </div>
        <div style={{fontSize:"0.66rem",color:T.silver,marginTop:2}}>Toca para ver planos a partir de €{PRICE_SOLO}/mês</div>
      </div>
      <div style={{fontSize:"0.7rem",color:urgent?T.red:T.gold,fontWeight:700,fontFamily:"'Josefin Sans',sans-serif",letterSpacing:"0.1em",flexShrink:0,marginLeft:10}}>VER →</div>
    </div>
  );
}

function SubscriptionScreen({barbers, subscription, onSubscribe, onBack}){
  const [plan,setPlan]=useState(subscription?.plan||"solo");
  const [collabs,setCollabs]=useState(Math.max(0,(barbers.filter(b=>b.active).length-1)));
  const soloPrice=PRICE_SOLO;
  const teamTotal=barbers.filter(b=>b.active).length * PRICE_TEAM;
  const isTeam=barbers.filter(b=>b.active).length>1;

  const totalPrice=plan==="solo"?soloPrice:teamTotal;

  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",color:T.light}}>
      <style>{GS}</style>
      <header style={{width:"100%",maxWidth:520,padding:"16px 20px 14px",borderBottom:`1px solid ${T.border}`,background:T.surface,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"0.95rem",letterSpacing:"0.12em",fontWeight:700,color:T.white}}>LC<span style={{color:T.gold}}>_</span>84<span style={{color:T.gold,fontSize:"0.82rem"}}>barbervision</span></div>
          <div style={{fontSize:"0.55rem",letterSpacing:"0.25em",color:T.silver,textTransform:"uppercase",marginTop:2}}>Subscrição</div>
        </div>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${T.border}`,color:T.silver,padding:"5px 10px",borderRadius:4,cursor:"pointer",fontSize:"0.58rem",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif"}}>← Voltar</button>
      </header>

      <main style={{width:"100%",maxWidth:520,padding:"24px 20px 60px"}}>

        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:"2.2rem",marginBottom:8}}>💈</div>
          <div style={{fontSize:"1.4rem",color:T.white,fontWeight:600,marginBottom:6}}>Escolhe o teu plano</div>
          <div style={{fontSize:"0.82rem",color:T.silver}}>Sem compromisso. Cancela quando quiseres.</div>
        </div>

        {/* Trial status */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"14px",marginBottom:20,textAlign:"center"}}>
          <Lbl style={{marginBottom:6}}>Estado do Trial</Lbl>
          <div style={{fontSize:"1.5rem",color:daysLeft(TRIAL_START)>0?T.gold:T.red,fontWeight:700}}>
            {daysLeft(TRIAL_START)>0?`${daysLeft(TRIAL_START)} dias restantes`:"Trial expirado"}
          </div>
          <div style={{fontSize:"0.7rem",color:T.silver,marginTop:4}}>Trial gratuito de {TRIAL_DAYS} dias</div>
          {/* progress bar */}
          <div style={{height:4,background:T.muted,borderRadius:2,marginTop:10,overflow:"hidden"}}>
            <div style={{height:"100%",background:daysLeft(TRIAL_START)>3?T.gold:T.red,borderRadius:2,width:`${Math.min(100,((TRIAL_DAYS-daysLeft(TRIAL_START))/TRIAL_DAYS)*100)}%`,transition:"width .5s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.58rem",color:T.silver,marginTop:4,fontFamily:"'Josefin Sans',sans-serif"}}>
            <span>Dia 1</span><span>Dia {TRIAL_DAYS}</span>
          </div>
        </div>

        {/* Plans */}
        <Lbl style={{marginBottom:12}}>Planos disponíveis</Lbl>

        {/* Solo */}
        <div onClick={()=>setPlan("solo")} style={{padding:"16px",marginBottom:10,background:plan==="solo"?T.goldLo:T.card,border:`2px solid ${plan==="solo"?T.gold:T.border}`,borderRadius:8,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <div style={{fontSize:"1.1rem",color:T.white,fontWeight:600}}>✂ Solo</div>
              <div style={{fontSize:"0.72rem",color:T.silver,marginTop:2}}>1 barbeiro independente</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"1.5rem",color:T.gold,fontWeight:700,lineHeight:1}}>€{soloPrice}</div>
              <div style={{fontSize:"0.62rem",color:T.silver}}>/mês</div>
            </div>
          </div>
          {["Agenda completa","Clientes e histórico","Contabilidade","Relatórios e impressão","Notificações"].map(f=>(
            <div key={f} style={{fontSize:"0.76rem",color:T.mid,marginBottom:3}}>✓ {f}</div>
          ))}
        </div>

        {/* Team */}
        <div onClick={()=>setPlan("team")} style={{padding:"16px",marginBottom:20,background:plan==="team"?T.goldLo:T.card,border:`2px solid ${plan==="team"?T.gold:T.border}`,borderRadius:8,cursor:"pointer",position:"relative"}}>
          <div style={{position:"absolute",top:-10,right:14,background:T.gold,color:"#000",fontSize:"0.58rem",letterSpacing:"0.15em",textTransform:"uppercase",padding:"3px 10px",borderRadius:10,fontFamily:"'Josefin Sans',sans-serif",fontWeight:700}}>POPULAR</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <div style={{fontSize:"1.1rem",color:T.white,fontWeight:600}}>💈 Equipa</div>
              <div style={{fontSize:"0.72rem",color:T.silver,marginTop:2}}>Barbearia com colaboradores</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"1.5rem",color:T.gold,fontWeight:700,lineHeight:1}}>€{PRICE_TEAM}</div>
              <div style={{fontSize:"0.62rem",color:T.silver}}>/barbeiro/mês</div>
            </div>
          </div>
          {["Tudo do plano Solo","Múltiplos barbeiros","Painel de administrador","Gestão de colaboradores","Métricas por barbeiro"].map(f=>(
            <div key={f} style={{fontSize:"0.76rem",color:T.mid,marginBottom:3}}>✓ {f}</div>
          ))}
          {/* Team calculator */}
          <div style={{marginTop:12,padding:"12px",background:T.surface,borderRadius:6,border:`1px solid ${T.border}`}}>
            <Lbl style={{marginBottom:8}}>Calculadora de equipa</Lbl>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:"0.82rem",color:T.mid}}>{barbers.filter(b=>b.active).length} barbeiro{barbers.filter(b=>b.active).length!==1?"s":""} ativos</div>
              <div style={{fontSize:"1.1rem",color:T.gold,fontWeight:700}}>€{teamTotal.toFixed(2)}/mês</div>
            </div>
            <div style={{fontSize:"0.66rem",color:T.silver,marginTop:4}}>
              {barbers.filter(b=>b.active).length} × €{PRICE_TEAM} = €{teamTotal.toFixed(2)}/mês
              {barbers.filter(b=>b.active).length>1&&<span style={{color:T.green,marginLeft:6}}>poupas €{((soloPrice*barbers.filter(b=>b.active).length)-teamTotal).toFixed(2)} vs Solo individual</span>}
            </div>
          </div>
        </div>

        {/* Total */}
        <div style={{background:T.card,border:`1px solid ${T.gold}`,borderRadius:8,padding:"14px",marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:"0.9rem",color:T.white,fontWeight:500}}>Plano {plan==="solo"?"Solo":"Equipa"}</div>
              <div style={{fontSize:"0.68rem",color:T.silver,marginTop:2}}>Renovação mensal automática</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"1.6rem",color:T.gold,fontWeight:700,lineHeight:1}}>€{plan==="solo"?soloPrice.toFixed(2):teamTotal.toFixed(2)}</div>
              <div style={{fontSize:"0.6rem",color:T.silver}}>/mês</div>
            </div>
          </div>
        </div>

        <Btn variant="gold" style={{width:"100%",padding:"15px",fontSize:"0.75rem"}} onClick={()=>onSubscribe(plan)}>
          Subscrever Agora — €{plan==="solo"?soloPrice.toFixed(2):teamTotal.toFixed(2)}/mês
        </Btn>
        <div style={{textAlign:"center",marginTop:10,fontSize:"0.68rem",color:T.silver}}>
          Pagamento seguro · Cancela a qualquer momento<br/>
          <span style={{color:T.gold}}>Demo: clica para simular subscrição</span>
        </div>

        {/* FAQ */}
        <div style={{marginTop:24}}>
          <Lbl style={{marginBottom:12}}>Perguntas frequentes</Lbl>
          {[
            ["Posso cancelar?","Sim, a qualquer momento. Sem penalizações."],
            ["Como adiciono colaboradores?","No painel Admin crias o perfil de cada barbeiro. No plano Equipa cada um paga €7,99/mês."],
            ["O que acontece após o trial?","A app bloqueia o acesso à agenda até subscreveres. Os dados ficam guardados."],
            ["Existem custos ocultos?","Não. O preço é fixo por barbeiro por mês."],
          ].map(([q,a])=>(
            <div key={q} style={{marginBottom:12,padding:"12px",background:T.card,border:`1px solid ${T.border}`,borderRadius:6}}>
              <div style={{fontSize:"0.85rem",color:T.white,fontWeight:500,marginBottom:4}}>{q}</div>
              <div style={{fontSize:"0.76rem",color:T.silver,lineHeight:1.5}}>{a}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ExpiredScreen({onSubscribe}){
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Cormorant Garamond',Georgia,serif",color:T.light}}>
      <style>{GS}</style>
      <div style={{textAlign:"center",maxWidth:300}}>
        <div style={{fontSize:"2.5rem",marginBottom:16}}>🔒</div>
        <div style={{fontSize:"1.4rem",color:T.white,fontWeight:600,marginBottom:8}}>Trial expirado</div>
        <div style={{fontSize:"0.84rem",color:T.silver,lineHeight:1.7,marginBottom:28}}>
          Os teus 15 dias gratuitos terminaram.<br/>
          Os teus dados estão guardados.<br/>
          Subscreve para continuar a usar a app.
        </div>
        <Btn variant="gold" style={{width:"100%",padding:"15px",marginBottom:12}} onClick={onSubscribe}>
          Ver Planos a partir de €9,99/mês
        </Btn>
        <div style={{fontSize:"0.68rem",color:T.silver}}>Sem compromisso · Cancela quando quiseres</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// OWNER PORTAL — login/registo de barbearias (multi-tenant)
// ══════════════════════════════════════════════════════════════════════════════
function OwnerPortal(){
  const [mode,setMode]     = useState("login"); // login | signup
  const [busy,setBusy]     = useState(false);
  const [err,setErr]       = useState("");

  // login fields
  const [email,setEmail]   = useState("");
  const [pass,setPass]     = useState("");

  // signup fields
  const [ownerName,setOwnerName] = useState("");
  const [salonName,setSalonName] = useState("");
  const [suEmail,setSuEmail]     = useState("");
  const [suPass,setSuPass]       = useState("");
  const [phone,setPhone]         = useState("");

  const goToShop=(slug)=>{
    const url=new URL(window.location.href);
    url.searchParams.set("loja",slug);
    window.location.href=url.toString();
  };

  const doLogin=async()=>{
    setErr("");
    if(!email||!pass){setErr("Preenche o email e a password.");return;}
    setBusy(true);
    const{data,error}=await supabase.rpc("verify_owner_login",{p_email:email.trim(),p_password:pass});
    setBusy(false);
    const row=Array.isArray(data)?data[0]:data;
    if(error||!row){setErr("Email ou password incorretos.");return;}
    goToShop(row.slug);
  };

  const doSignup=async()=>{
    setErr("");
    if(!ownerName||!salonName||!suEmail||!suPass){setErr("Preenche todos os campos.");return;}
    setBusy(true);
    const{data:existing}=await supabase.from("shops").select("id").eq("owner_email",suEmail.trim().toLowerCase()).maybeSingle();
    if(existing){setBusy(false);setErr("Já existe uma barbearia registada com esse email.");return;}
    const slug=await generateUniqueSlug(salonName);
    const initData={
      shop:{name:salonName,address:"",phone:phone||"",bio:"",adminPin:"admin"},
      barbers:[{id:mkId(),name:ownerName,role:"Dono",pin:"1111",phone:phone||"",bio:"",avatar:ownerName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),color:"#b8955a",schedule:{workDays:[1,2,3,4,5,6],startHour:"09:00",endHour:"19:00"},active:true}],
      services:INIT_SERVICES,
      bookings:[],
      notifications:[],
      clientNotes:{},
    };
    const{error}=await supabase.from("shops").insert({
      owner_email:suEmail.trim().toLowerCase(),
      owner_password:suPass,
      slug,
      data:initData,
    });
    setBusy(false);
    if(error){setErr("Não foi possível criar a barbearia. Tenta outra vez.");return;}
    goToShop(slug);
  };

  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Josefin Sans',sans-serif"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <img src={logoIcon} style={{width:56,height:56,marginBottom:10,objectFit:"contain"}}/>
        <div style={{fontSize:"1.5rem",color:T.white,fontWeight:600,letterSpacing:"0.08em"}}>Portal do Dono</div>
        <div style={{fontSize:"0.75rem",color:T.silver,marginTop:4}}>Entra ou cria a tua barbearia</div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:20,background:T.card,borderRadius:6,padding:4}}>
        <button onClick={()=>{setMode("login");setErr("");}} style={{padding:"8px 18px",borderRadius:4,border:"none",cursor:"pointer",background:mode==="login"?T.gold:"transparent",color:mode==="login"?"#0a0a0a":T.silver,fontWeight:600,fontSize:"0.8rem"}}>Já tenho conta</button>
        <button onClick={()=>{setMode("signup");setErr("");}} style={{padding:"8px 18px",borderRadius:4,border:"none",cursor:"pointer",background:mode==="signup"?T.gold:"transparent",color:mode==="signup"?"#0a0a0a":T.silver,fontWeight:600,fontSize:"0.8rem"}}>Criar barbearia</button>
      </div>

      <div style={{width:"100%",maxWidth:340,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:22}}>
        {mode==="login"?(
          <>
            <div style={{marginBottom:12}}>
              <Lbl style={{marginBottom:6}}>Email</Lbl>
              <Inp value={email} onChange={e=>setEmail(e.target.value)} placeholder="o-teu-email@exemplo.com"/>
            </div>
            <div style={{marginBottom:16}}>
              <Lbl style={{marginBottom:6}}>Password</Lbl>
              <Inp type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/>
            </div>
            {err&&<div style={{color:T.red,fontSize:"0.76rem",marginBottom:12,textAlign:"center"}}>{err}</div>}
            <Btn variant="gold" style={{width:"100%",padding:13}} onClick={doLogin} disabled={busy}>{busy?"A entrar...":"Entrar"}</Btn>
          </>
        ):(
          <>
            <div style={{marginBottom:12}}>
              <Lbl style={{marginBottom:6}}>O teu nome</Lbl>
              <Inp value={ownerName} onChange={e=>setOwnerName(e.target.value)} placeholder="Nome completo"/>
            </div>
            <div style={{marginBottom:12}}>
              <Lbl style={{marginBottom:6}}>Nome da barbearia</Lbl>
              <Inp value={salonName} onChange={e=>setSalonName(e.target.value)} placeholder="Ex: Barbearia do Zé"/>
            </div>
            <div style={{marginBottom:12}}>
              <Lbl style={{marginBottom:6}}>Telefone (opcional)</Lbl>
              <Inp value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+351 9xx xxx xxx"/>
            </div>
            <div style={{marginBottom:12}}>
              <Lbl style={{marginBottom:6}}>Email</Lbl>
              <Inp value={suEmail} onChange={e=>setSuEmail(e.target.value)} placeholder="o-teu-email@exemplo.com"/>
            </div>
            <div style={{marginBottom:16}}>
              <Lbl style={{marginBottom:6}}>Password</Lbl>
              <Inp type="password" value={suPass} onChange={e=>setSuPass(e.target.value)} placeholder="Cria uma password"/>
            </div>
            {err&&<div style={{color:T.red,fontSize:"0.76rem",marginBottom:12,textAlign:"center"}}>{err}</div>}
            <Btn variant="gold" style={{width:"100%",padding:13}} onClick={doSignup} disabled={busy}>{busy?"A criar...":"Criar a minha barbearia"}</Btn>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const [lang,setLang]                   = useState("pt");
  const [barbers,setBarbers]             = useState(INIT_BARBERS);
  const [services,setServices]           = useState(INIT_SERVICES);
  const [shop,setShop]                   = useState(INIT_SHOP);
  const [bookings,setBookings]           = useState([]);
const [notifications,setNotifications] = useState([]);
  const [clientNotes,setClientNotes]     = useState(INIT_CLIENT_NOTES);
  const [cutRecords,setCutRecords]       = useState({});
  const [role,setRole]                   = useState("entry");
  const [activeBarber,setActiveBarber]   = useState(null);
  const [bScreen,setBScreen]             = useState("dashboard");
  const [dataLoaded,setDataLoaded]       = useState(false);
  const [shopId,setShopId]               = useState(null);
  const [ownerMode,setOwnerMode]         = useState(false);
  const [shopNotFound,setShopNotFound]   = useState(false);

  useEffect(()=>{
    (async()=>{
      const params=new URLSearchParams(window.location.search);
      let slug=params.get("loja");
      if(!slug){
        const lastShop=localStorage.getItem("lc84_last_shop");
        if(lastShop){
          window.location.replace(`${window.location.pathname}?loja=${lastShop}`);
          return;
        }
        setOwnerMode(true);
        setDataLoaded(true);
        return;
      }
      localStorage.setItem("lc84_last_shop",slug);
      const{data,error}=await supabase.from("shops").select("id,data").eq("slug",slug).maybeSingle();
      if(error||!data){
        if(error)console.error("Erro a carregar:",error);
        setShopNotFound(true);
        setDataLoaded(true);
        return;
      }
      const d=data.data||{};
      setShopId(data.id);
      if(!d||Object.keys(d).length===0){
        setBarbers(INIT_BARBERS);setServices(INIT_SERVICES);setShop(INIT_SHOP);
        setBookings(seedBookings(INIT_BARBERS));setNotifications(seedNotifications(INIT_BARBERS));
        setClientNotes(INIT_CLIENT_NOTES);setCutRecords({});
      } else {
        setBarbers(d.barbers||INIT_BARBERS);
        setServices(d.services||INIT_SERVICES);
        setShop(d.shop||INIT_SHOP);
        setBookings(d.bookings||[]);
        setNotifications(d.notifications||[]);
        setClientNotes(d.clientNotes||{});
        setCutRecords(d.cutRecords||{});
      }
      setDataLoaded(true);
    })();
  },[]);

  useEffect(()=>{
    if(!dataLoaded||!shopId)return;
    const t=setTimeout(()=>{
      supabase.from("shops").update({
        data:{barbers,services,shop,bookings,notifications,clientNotes,cutRecords},
        updated_at:new Date().toISOString(),
      }).eq("id",shopId).then(({error})=>{if(error)console.error("Erro a guardar:",error);});
    },800);
    return()=>clearTimeout(t);
  },[barbers,services,shop,bookings,notifications,clientNotes,cutRecords,dataLoaded,shopId]);
 

  // Subscription state
  const [subscription,setSubscription]   = useState(null); // null=trial, {plan,date}=active
  const [showSub,setShowSub]             = useState(false);
  const trialDays = daysLeft(TRIAL_START);
  const trialExpired = trialDays === 0 && !subscription;
  if(!dataLoaded){
    return(
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.gold,fontFamily:"'Josefin Sans',sans-serif",fontSize:"0.8rem",letterSpacing:"0.2em"}}>
        A CARREGAR...
      </div>
    );
  }

  if(ownerMode) return <OwnerPortal/>;

  if(shopNotFound){
    return(
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",fontFamily:"'Josefin Sans',sans-serif"}}>
        <div style={{fontSize:"2rem",marginBottom:16}}>🔍</div>
        <div style={{color:T.white,fontSize:"1.1rem",marginBottom:8}}>Barbearia não encontrada</div>
        <div style={{color:T.silver,fontSize:"0.8rem",marginBottom:20}}>O link que usaste não corresponde a nenhuma barbearia registada.</div>
        <Btn variant="gold" onClick={()=>{window.location.href=window.location.origin+window.location.pathname;}}>Ir para o Portal do Dono</Btn>
      </div>
    );
  }

  const addNotification=(barberId,type,title,body)=>{
    setNotifications(p=>[{id:mkId(),barberId,type,title,body,ts:Date.now(),read:false},...p]);
  };

  const onBarberLogin=(b)=>{
    setActiveBarber(b);setBScreen("dashboard");setRole("barber");
    const todayCount=bookings.filter(bk=>bk.barberId===b.id&&bk.date===TODAY&&!bk.blocked).length;
    if(todayCount>0){

      const first=bookings.filter(bk=>bk.barberId===b.id&&bk.date===TODAY&&!bk.blocked).sort((a,bb)=>a.time.localeCompare(bb.time))[0];
      setNotifications(p=>[{id:mkId(),barberId:b.id,type:"reminder",title:`Bom dia, ${b.name.split(" ")[0]}!`,body:`Tens ${todayCount} marcação${todayCount>1?"s":""} hoje. Primeira às ${first?.time}h.`,ts:Date.now(),read:false},...p]);
    }
  };

  const handleSubscribe=(plan)=>{
    setSubscription({plan,date:TODAY,barbersCount:barbers.filter(b=>b.active).length});
    setShowSub(false);
    addNotification(activeBarber?.id||"b1","info","Subscrição ativada",`Plano ${plan==="solo"?"Solo":"Equipa"} ativo. Obrigado, Luis!`);
  };

  if(showSub) return <SubscriptionScreen barbers={barbers} subscription={subscription} onSubscribe={handleSubscribe} onBack={()=>setShowSub(false)}/>;

  if(role==="entry")  return <EntryScreen shop={shop} onClient={()=>setRole("client")} onBarber={()=>setRole("login")} lang={lang} setLang={setLang}/>;
  if(role==="login")  return <LoginScreen barbers={barbers} setBarbers={setBarbers} shop={shop} onBarberLogin={onBarberLogin} onAdminLogin={()=>setRole("admin")} onBack={()=>setRole("entry")} lang={lang}/>;
  if(role==="client") return <ClientArea bookings={bookings} setBookings={setBookings} services={services} barbers={barbers} shop={shop} addNotification={addNotification} onBack={()=>setRole("entry")} lang={lang}/>;
  if(role==="admin")  return <AdminPanel bookings={bookings} barbers={barbers} setBarbers={setBarbers} services={services} setServices={setServices} shop={shop} setShop={setShop} shopId={shopId} onLogout={()=>setRole("entry")}/>;

  // Trial expired — block barber access
  if(role==="barber" && trialExpired) return <ExpiredScreen onSubscribe={()=>setShowSub(true)}/>;

  // BARBER APP
  const barber=barbers.find(b=>b.id===activeBarber?.id)||activeBarber;
  const myUnread=notifications.filter(n=>n.barberId===barber.id&&!n.read).length;
  const NAV=[{id:"dashboard",l:"Início"},{id:"agenda",l:"Agenda"},{id:"notifs",l:"Alertas",badge:myUnread},{id:"clients",l:"Clientes"},{id:"reports",l:"Receita"},{id:"schedule",l:"Horário"},{id:"profile",l:"Perfil"}];

  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",color:T.light}}>
      <style>{GS}</style>
      <header style={{width:"100%",maxWidth:520,borderBottom:`1px solid ${T.border}`,background:T.surface,position:"sticky",top:0,zIndex:10}}>
        {/* MARCA — sempre visível */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 20px",borderBottom:`1px solid ${T.border}`}}>
          <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"1.05rem",fontWeight:700,letterSpacing:"0.08em",color:T.white}}>
            LC<span style={{color:T.gold}}>_</span>84<span style={{color:T.gold}}>barbervision</span>
          </span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {subscription
              ?<span style={{fontSize:"0.54rem",background:T.greenLo,color:T.green,border:`1px solid ${T.green}`,padding:"2px 8px",borderRadius:10,fontFamily:"'Josefin Sans',sans-serif"}}>✓ ATIVO</span>
              :<button onClick={()=>setShowSub(true)} style={{fontSize:"0.54rem",background:trialDays<=3?T.redLo:T.goldLo,color:trialDays<=3?T.red:T.gold,border:`1px solid ${trialDays<=3?T.red:T.gold}`,padding:"2px 8px",borderRadius:10,fontFamily:"'Josefin Sans',sans-serif",cursor:"pointer"}}>⏳ {trialDays}d</button>
            }
            <button onClick={()=>setRole("entry")} title={LANGS[lang].t.logout} style={{background:"none",border:`1px solid ${T.border}`,color:T.silver,width:24,height:24,borderRadius:4,cursor:"pointer",fontSize:"0.7rem",display:"flex",alignItems:"center",justifyContent:"center"}}>⏻</button>
          </div>
        </div>
        {/* Barbeiro + data */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 20px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <Avatar barber={barber} size={22}/>
            <span style={{fontSize:"0.68rem",color:T.mid}}>{barber.name}</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:"0.6rem",color:T.gold,fontFamily:"'Josefin Sans',sans-serif"}}>{bookings.filter(b=>b.barberId===barber.id&&b.date===TODAY&&!b.blocked).length} hoje</span>
            <span style={{fontSize:"0.6rem",color:T.silver,fontFamily:"'Josefin Sans',sans-serif"}}>{LANGS[lang].wdays[NOW.getDay()]} {NOW.getDate()} {LANGS[lang].months[NOW.getMonth()].slice(0,3)}</span>
          </div>
        </div>
        {/* Nav */}
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setBScreen(n.id)} style={{padding:"8px 11px",background:"none",border:"none",borderBottom:`2px solid ${bScreen===n.id?barber.color:"transparent"}`,cursor:"pointer",color:bScreen===n.id?barber.color:T.silver,fontSize:"0.58rem",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'Josefin Sans',sans-serif",fontWeight:bScreen===n.id?700:400,whiteSpace:"nowrap",position:"relative"}}>
              {n.l}
              {n.badge>0&&<span style={{position:"absolute",top:4,right:2,background:T.red,color:"#fff",borderRadius:"50%",width:14,height:14,fontSize:"0.5rem",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Josefin Sans',sans-serif"}}>{n.badge>9?"9+":n.badge}</span>}
            </button>
          ))}
        </div>
      </header>

      {/* Trial banner inside app */}
      {!subscription&&<div style={{width:"100%",maxWidth:520,paddingTop:14}}><TrialBanner days={trialDays} onSubscribe={()=>setShowSub(true)}/></div>}

      <main style={{width:"100%",maxWidth:520,flex:1,paddingTop:!subscription&&trialDays<=5?0:18,paddingBottom:40}}>
        {bScreen==="dashboard"&&<BDashboard bookings={bookings} services={services} barber={barber} lang={lang}/>}
        {bScreen==="agenda"   &&<BAgenda    bookings={bookings} setBookings={setBookings} services={services} barbers={barbers} barber={barber} addNotification={addNotification} lang={lang}/>}
        {bScreen==="notifs"   &&<BNotifications notifications={notifications} setNotifications={setNotifications} barber={barber} lang={lang}/>}
        {bScreen==="clients"  &&<BClients   bookings={bookings} services={services} barber={barber} clientNotes={clientNotes} setClientNotes={setClientNotes} cutRecords={cutRecords} setCutRecords={setCutRecords} shopId={shopId} lang={lang}/>}
        {bScreen==="reports"  &&<BReports   bookings={bookings} setBookings={setBookings} services={services} barber={barber} lang={lang}/>}
        {bScreen==="schedule" &&<BSchedule  barber={barber} setBarbers={setBarbers} lang={lang}/>}
        {bScreen==="profile"  &&<BProfile   barber={barber} setBarbers={setBarbers} shopId={shopId} onLogout={()=>setRole("entry")} lang={lang}/>}
      </main>
    </div>
  );
}