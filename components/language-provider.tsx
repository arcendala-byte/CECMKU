"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "fr";

const translations: Record<string, string> = {
  "About": "À propos",
  "Election": "Élection",
  "Results": "Résultats",
  "Contact": "Contact",
  "Voter Login": "Connexion électeur",
  "Sign in": "Se connecter",
  "Signing in...": "Connexion...",
  "CECMKU Portal": "Portail CECMKU",
  "Sign in to participate in the community election": "Connectez-vous pour participer à l'élection communautaire",
  "Don't have an account?": "Vous n'avez pas de compte ?",
  "Request Access": "Demander l'accès",
  "Need help?": "Besoin d'aide ?",
  "Contact the committee": "Contacter le comité",
  "Voters": "Électeurs",
  "Audit Logs": "Journaux d'audit",
  "Settings": "Paramètres",
  "Sign out": "Se déconnecter",
  "Admin Portal": "Portail administrateur",
  "Your Voice.": "Votre voix.",
  "Your Leadership.": "Votre leadership.",
  "Your Future.": "Votre avenir.",
  "Explore Candidates": "Découvrir les candidats",
  "How Voting Works": "Comment voter",
  "Get Ready to Vote": "Préparez-vous à voter",
  "Voting is Currently Open": "Le vote est actuellement ouvert",
  "Voting Begins In": "Le vote commence dans",
  "Voting Closes In": "Le vote se termine dans",
  "Access Voter Portal": "Accéder au portail électeur",
  "Be Part of the Decision.": "Prenez part à la décision.",
  "Your Vote. Your Choice.": "Votre vote. Votre choix.",
  "Sign In": "Se connecter",
  "Choose Your Candidates": "Choisissez vos candidats",
  "Submit Your Vote": "Soumettre votre vote",
  "View Official Results": "Voir les résultats officiels",
  "Current Election": "Élection en cours",
  "Status": "Statut",
  "Voting Opens": "Ouverture du vote",
  "Voting Closes": "Fin du vote",
  "Days": "Jours",
  "Hours": "Heures",
  "Mins": "Min",
  "Secs": "Sec",
  "Add New Candidate": "Ajouter un candidat",
  "Edit Candidate": "Modifier le candidat",
  "Save Candidate": "Enregistrer le candidat",
  "Deleting...": "Suppression...",
  "Delete this candidate? Draft election assignments will also be removed. Candidates with voting or published result records are protected.":
    "Supprimer ce candidat ? Ses affectations aux élections en brouillon seront également supprimées. Les candidats associés à des votes ou à des résultats publiés sont protégés.",
  "Invalid candidate.": "Candidat invalide.",
  "Candidate not found.": "Candidat introuvable.",
  "Candidates with voting or result records cannot be deleted.":
    "Les candidats associés à des votes ou à des résultats ne peuvent pas être supprimés.",
  "Candidates assigned to non-draft elections cannot be deleted.":
    "Les candidats affectés à des élections qui ne sont pas en brouillon ne peuvent pas être supprimés.",
  "Failed to update candidate. Please try again.":
    "La mise à jour du candidat a échoué. Veuillez réessayer.",
  "Failed to delete candidate. Refresh and try again.":
    "La suppression du candidat a échoué. Actualisez la page et réessayez.",
  "Biography": "Biographie",
  "Manifesto": "Programme",
  "Edit": "Modifier",
  "Activate": "Activer",
  "Suspend": "Suspendre",
  "Approve": "Approuver",
  "Delete": "Supprimer",
  "Search": "Rechercher",
  "Pending": "En attente",
  "Inactive": "Inactif",
  "Suspended": "Suspendu",
  "Candidate Registrations": "Candidatures",
  "CECMKU Elections": "Élections CECMKU",
  "Submit Candidate Application": "Soumettre ma candidature",
  "Personal and academic details": "Informations personnelles et académiques",
  "Campaign information": "Informations de campagne",
  "Photograph and documents": "Photo et documents",
  "Registration/admission number": "Numéro d'inscription/admission",
  "Phone number": "Numéro de téléphone",
  "Faculty or school": "Faculté ou école",
  "Department": "Département",
  "Course/programme": "Cours/programme",
  "Year of study": "Année d'études",
  "Position you intend to contest": "Poste visé",
  "Candidate profile / biography": "Profil du candidat / biographie",
  "Manifesto / statement of intent": "Manifeste / déclaration d'intention",
  "Profile photograph": "Photo de profil",
  "Supporting documents (optional)": "Documents justificatifs (facultatifs)",
  "Application submitted": "Candidature envoyée",
  "Keep this reference for your records:": "Conservez cette référence :",
  "Review application": "Examiner la candidature",
  "Supporting documents": "Documents justificatifs",
  "Review decision": "Décision de candidature",
  "Edit application information": "Modifier les informations de candidature",
  "CECMKU Voter Portal": "Portail électeur CECMKU",
  "Open navigation menu": "Ouvrir le menu de navigation",
  "Close navigation menu": "Fermer le menu de navigation",
  "Transparency": "Transparence",
  "Register": "S'inscrire",
  "Home": "Accueil",
  "Register as a candidate": "S'inscrire comme candidat",
  "MKU Congolese Students Community": "Communauté des étudiants congolais de MKU",
  "Every vote shapes the future of our community. Discover the candidates, explore their vision and take part in choosing the leaders who will represent us.":
    "Chaque vote façonne l'avenir de notre communauté. Découvrez les candidats, explorez leur vision et participez au choix de nos représentants.",
  "An election platform for registered community members.":
    "Une plateforme électorale réservée aux membres inscrits de la communauté.",
  "Voting has Concluded": "Le vote est terminé",
  "The election committee is currently verifying the final results. Official results will be published shortly.":
    "Le comité électoral vérifie actuellement les résultats définitifs. Les résultats officiels seront bientôt publiés.",
  "Official Results Published": "Résultats officiels publiés",
  "The verified results for the": "Les résultats vérifiés de l'élection",
  "are now available for public viewing.": "sont maintenant accessibles au public.",
  "A straightforward, secure process designed to ensure every voice is heard.":
    "Un processus simple et sécurisé conçu pour que chaque voix soit entendue.",
  "Access the platform using your registered voter credentials.":
    "Accédez à la plateforme avec vos identifiants d'électeur.",
  "Review candidate profiles and select your preferred representatives.":
    "Consultez les profils des candidats et choisissez vos représentants préférés.",
  "Review your selections and securely submit your ballot.":
    "Vérifiez vos choix et soumettez votre bulletin en toute sécurité.",
  "Your participation matters. Take an active role in shaping the future of our community.":
    "Votre participation compte. Prenez une part active à la construction de l'avenir de notre communauté.",
  "Election Timeline": "Calendrier électoral",
  "The official voting period is approaching. Make sure your account is active and ready.":
    "La période officielle de vote approche. Assurez-vous que votre compte est actif et prêt.",
  "The polls are open! Make sure you cast your ballot before time runs out.":
    "Le scrutin est ouvert ! Pensez à voter avant la clôture.",
  "Stay informed about the current election status and when you can cast your ballot.":
    "Restez informé du statut de l'élection et de la période pendant laquelle vous pourrez voter.",
  "Check back soon for upcoming election timelines.":
    "Consultez cette page bientôt pour connaître le calendrier des prochaines élections.",
  "No candidates available at this time.": "Aucun candidat n'est disponible pour le moment.",
  "View Profile": "Voir le profil",
  "No candidates found.": "Aucun candidat trouvé.",
  "Candidate Profile": "Profil du candidat",
  "Back to Candidates": "Retour aux candidats",
  "No election information is currently available.": "Aucune information électorale n'est disponible pour le moment.",
  "Election Information": "Informations sur l'élection",
  "Voting Period": "Période de vote",
  "Start Date": "Date de début",
  "End Date": "Date de fin",
  "Positions & Candidates": "Postes et candidats",
  "No candidates have been assigned to this position yet.": "Aucun candidat n'a encore été affecté à ce poste.",
  "Official Election Results": "Résultats officiels de l'élection",
  "Results have not yet been published.": "Les résultats n'ont pas encore été publiés.",
  "No results are currently available.": "Aucun résultat n'est disponible pour le moment.",
  "About CECMKU": "À propos de la CECMKU",
  "Our Mission": "Notre mission",
  "Our Vision": "Notre vision",
  "Send us a message": "Envoyez-nous un message",
  "Your name": "Votre nom",
  "Your email": "Votre adresse e-mail",
  "Subject": "Objet",
  "Message": "Message",
  "Send Message": "Envoyer le message",
  "Voter Guidelines": "Guide de l'électeur",
  "How to Vote": "Comment voter",
  "Before You Vote": "Avant de voter",
  "During Voting": "Pendant le vote",
  "After Voting": "Après le vote",
  "How the election is conducted": "Déroulement de l'élection",
  "Submit your details and campaign information for administrator review. You can apply before an election is set up.":
    "Soumettez vos informations personnelles et de campagne pour examen par l'administration. Vous pouvez postuler avant la création d'une élection.",
  "JPEG, PNG, or WebP; maximum 5 MB. This is required.":
    "JPEG, PNG ou WebP ; 5 Mo maximum. Ce fichier est obligatoire.",
  "PDF files only; up to 5 documents, 10 MB each.":
    "Fichiers PDF uniquement ; jusqu'à 5 documents, 10 Mo chacun.",
  "Your application files are stored privately and can only be accessed by authorized election administrators.":
    "Les fichiers de votre candidature sont conservés de manière confidentielle et ne sont accessibles qu'aux administrateurs électoraux autorisés.",
  "Submitting application...": "Envoi de la candidature...",
  "Election committee": "Comité électoral",
  "Applications": "Candidatures",
  "application": "candidature",
  "applications": "candidatures",
  "showing": "affichage",
  "Approved": "Approuvée",
  "Rejected": "Rejetée",
  "Filter": "Filtrer",
  "Export CSV": "Exporter en CSV",
  "Reference": "Référence",
  "Applicant": "Candidat",
  "Position": "Poste",
  "Submitted": "Soumise le",
  "No candidate applications found.": "Aucune candidature trouvée.",
  "Page": "Page",
  "Previous": "Précédent",
  "Next": "Suivant",
  "Candidate registrations": "Candidatures",
  "Election cycle": "Cycle électoral",
  "Email": "E-mail",
  "Phone": "Téléphone",
  "Faculty/school": "Faculté/école",
  "Intended position": "Poste visé",
  "No supporting documents attached.": "Aucun document justificatif joint.",
  "Linked candidate record:": "Dossier candidat associé :",
  "Application marked pending.": "Candidature marquée comme en attente.",
  "Application marked approved.": "Candidature approuvée.",
  "Application marked rejected.": "Candidature rejetée.",
  "Could not update application.": "Impossible de mettre à jour la candidature.",
  "Approve & add candidate": "Approuver et ajouter le candidat",
  "Reject": "Rejeter",
  "Mark pending": "Marquer comme en attente",
  "Save application details": "Enregistrer les informations de candidature",
  "Application information": "Informations sur la candidature",
  "Registration Submitted": "Inscription envoyée",
  "Redirecting to login...": "Redirection vers la connexion...",
  "Submit your details to request voting access.": "Soumettez vos informations pour demander l'accès au vote.",
  "Email Address": "Adresse e-mail",
  "Voter ID": "Identifiant d'électeur",
  "Reg No.": "N° d'inscription",
  "Initial Password": "Mot de passe initial",
  "Provide this password to the voter so they can log in.": "Remettez ce mot de passe à l'électeur pour qu'il puisse se connecter.",
  "Registering...": "Inscription...",
  "Register Voter": "Inscrire l'électeur",
  "Already have an account?": "Vous avez déjà un compte ?",
  "Welcome back,": "Heureux de vous revoir,",
  "Your participation helps shape the future of our community.": "Votre participation contribue à façonner l'avenir de notre communauté.",
  "There are currently no active elections.": "Aucune élection n'est actuellement en cours.",
  "positions to vote for": "postes à pourvoir",
  "Voting Completed": "Vote effectué",
  "Your ballot has been successfully submitted and recorded anonymously.": "Votre bulletin a été soumis avec succès et enregistré de manière anonyme.",
  "Your vote is pending": "Votre vote est en attente",
  "Cast your ballot before the election closes.": "Soumettez votre bulletin avant la clôture de l'élection.",
  "Return to Home": "Retour à l'accueil",
  "Your voter profile could not be found. Please contact the election committee.": "Votre profil d'électeur est introuvable. Veuillez contacter le comité électoral.",
  "Vote Now": "Voter maintenant",
  "Mandatory": "Obligatoire",
  "of": "sur",
  "positions selected": "postes sélectionnés",
  "Submit Ballot": "Soumettre le bulletin",
  "Overview": "Vue d'ensemble",
  "Pending Applications": "Candidatures en attente",
  "Active Elections": "Élections en cours",
  "Published Results": "Résultats publiés",
  "Add Voter": "Ajouter un électeur",
  "All statuses": "Tous les statuts",
  "Actions": "Actions",
  "No voters registered yet.": "Aucun électeur n'est encore inscrit.",
  "Elections": "Élections",
  "Title": "Titre",
  "Dates": "Dates",
  "Votes Cast": "Votes exprimés",
  "No elections created yet.": "Aucune élection n'a encore été créée.",
  "Positions": "Postes",
  "Add Candidate": "Ajouter un candidat",
  "No candidates added yet.": "Aucun candidat n'a encore été ajouté.",
  "Created": "Créé le",
  "All Positions": "Tous les postes",
  "Positions are managed per-election. Please go to the Elections tab, select an election, and manage its positions there.":
    "Les postes sont gérés pour chaque élection. Accédez à l'onglet Élections, sélectionnez une élection et gérez ses postes.",
  "No elections are ready for results verification. Close an active election first.":
    "Aucune élection n'est prête à être vérifiée. Veuillez d'abord clôturer une élection en cours.",
  "Reports": "Rapports",
  "CSV and PDF report generation will be available here.": "La génération de rapports CSV et PDF sera disponible ici.",
  "A chronological record of all system actions.": "Un historique chronologique de toutes les actions du système.",
  "Timestamp": "Horodatage",
  "Action": "Action",
  "Actor": "Auteur",
  "Details": "Détails",
  "No audit logs found.": "Aucun journal d'audit trouvé.",
  "System Settings": "Paramètres système",
  "Manage platform configuration and security preferences.": "Gérez la configuration de la plateforme et les préférences de sécurité.",
  "Election Integrity": "Intégrité électorale",
  "Ballot Secrecy Mode": "Mode de confidentialité du bulletin",
  "Voter identities are cryptographically separated from their ballots.": "Les identités des électeurs sont séparées cryptographiquement de leurs bulletins.",
  "Enabled": "Activé",
  "Double Voting Prevention": "Prévention du double vote",
  "Database constraints prevent a voter from submitting more than one ballot.": "Les contraintes de la base de données empêchent un électeur de soumettre plusieurs bulletins.",
  "Database Management": "Gestion de la base de données",
  "Automated Backups": "Sauvegardes automatiques",
  "It is highly recommended to back up your MySQL database regularly, especially before major elections.":
    "Il est fortement recommandé de sauvegarder régulièrement votre base de données MySQL, surtout avant les élections importantes.",
  "Download Database Backup (.sql)": "Télécharger la sauvegarde de la base de données (.sql)",
  "Platform Information": "Informations sur la plateforme",
  "Application Name": "Nom de l'application",
  "Version": "Version",
  "Back to Voters": "Retour aux électeurs",
  "Register New Voter": "Inscrire un nouvel électeur",
  "Registration Number": "Numéro d'inscription",
  "e.g., V-1001": "ex. : V-1001",
  "Submitting...": "Envoi...",
  "Back to Elections": "Retour aux élections",
  "Election Title": "Titre de l'élection",
  "Description": "Description",
  "Start Date & Time": "Date et heure de début",
  "End Date & Time": "Date et heure de fin",
  "Creating...": "Création...",
  "Schedule Election (Show Countdown)": "Programmer l'élection (afficher le compte à rebours)",
  "Open Voting Now": "Ouvrir le vote maintenant",
  "Close Voting": "Clôturer le vote",
  "Delete Election": "Supprimer l'élection",
  "Delete this election? This cannot be undone. Elections with voting or result records are protected.":
    "Supprimer cette élection ? Cette action est irréversible. Les élections comportant des votes ou des résultats sont protégées.",
  "Add Position": "Ajouter un poste",
  "Position Title": "Intitulé du poste",
  "Brief description": "Brève description",
  "Cancel": "Annuler",
  "Save Position": "Enregistrer le poste",
  "No positions created yet.": "Aucun poste n'a encore été créé.",
  "Select a candidate...": "Sélectionner un candidat...",
  "Assign": "Affecter",
  "Assign Candidate": "Affecter un candidat",
  "Edit Voter": "Modifier l'électeur",
  "Save Changes": "Enregistrer les modifications",
  "Save Election": "Enregistrer l'élection",
  "Election updated.": "Élection mise à jour.",
  "Candidate Photo (Optional)": "Photo du candidat (facultatif)",
  "Choose Picture": "Choisir une photo",
  "Course": "Cours",
  "Academic Year": "Année universitaire",
  "Campaign Slogan (Optional)": "Slogan de campagne (facultatif)",
  "JPG, PNG, or WebP. Maximum 5 MB.": "JPG, PNG ou WebP. 5 Mo maximum.",
  "Active": "Actif",
  "Saving...": "Enregistrement...",
  "Results Management": "Gestion des résultats",
  "Status:": "Statut :",
  "Calculate Results": "Calculer les résultats",
  "Verify & Publish": "Vérifier et publier",
  "Click \"Calculate Results\" to tally the anonymous ballots.": "Cliquez sur « Calculer les résultats » pour dépouiller les bulletins anonymes.",
  "Unknown": "Inconnu",
  "System": "Système",
  "DRAFT": "BROUILLON",
  "SCHEDULED": "PROGRAMMÉE",
  "OPEN": "OUVERTE",
  "CLOSED": "CLÔTURÉE",
  "RESULTS PENDING": "RÉSULTATS EN ATTENTE",
  "PUBLISHED": "PUBLIÉS",
  "PENDING": "EN ATTENTE",
  "APPROVED": "APPROUVÉE",
  "REJECTED": "REJETÉE",
  "ACTIVE": "ACTIF",
  "SUSPENDED": "SUSPENDU",
  "Application": "Candidature",
  "Profile": "Profil",
  "Policy": "Politique",
  "Privacy": "Confidentialité",
  "Election Policy": "Politique électorale",
  "Quick Links": "Liens rapides",
  "Election Info": "Informations électorales",
  "Contact Us": "Nous contacter",
  "Election Transparency": "Transparence électorale",
  "Constitution (PDF)": "Constitution (PDF)",
  "The official electronic voting platform for the Congolese Students Community at Mount Kenya University.":
    "La plateforme officielle de vote électronique de la Communauté des étudiants congolais de l'Université Mount Kenya.",
  "All rights reserved.": "Tous droits réservés.",
  "About Us": "À propos de nous",
  "Name": "Nom",
  "Email address": "Adresse e-mail",
  "The election committee will review your application.": "Le comité électoral examinera votre candidature.",
  "Current election": "Élection en cours",
  "This field is required.": "Ce champ est obligatoire.",
  "Invalid email address.": "Adresse e-mail invalide.",
  "About the Election": "À propos de l'élection",
  "Welcome to the official election portal for the Congolese Students Community at Mount Kenya University. This platform was built to ensure a free, fair, and transparent democratic process for all eligible members.":
    "Bienvenue sur le portail électoral officiel de la Communauté des étudiants congolais de l'Université Mount Kenya. Cette plateforme a été créée pour garantir un processus démocratique libre, équitable et transparent à tous les membres éligibles.",
  "Our goal is to provide a seamless digital voting experience that protects the integrity of every ballot. Through secure authentication and anonymous ballot recording, we ensure that your voice is heard without compromising your privacy.":
    "Notre objectif est d'offrir une expérience de vote numérique fluide qui protège l'intégrité de chaque bulletin. Grâce à une authentification sécurisée et à l'enregistrement des bulletins, nous veillons à ce que votre voix soit entendue tout en protégeant votre vie privée.",
  "Our Commitment": "Notre engagement",
  "Integrity:": "Intégrité :",
  "Every vote is counted accurately and securely.": "Chaque vote est comptabilisé avec précision et en toute sécurité.",
  "Transparency:": "Transparence :",
  "The process is open to observation by all community members.": "Le processus peut être observé par tous les membres de la communauté.",
  "Accessibility:": "Accessibilité :",
  "The platform works on any device, ensuring everyone can participate.": "La plateforme fonctionne sur tous les appareils afin que chacun puisse participer.",
  "Community Constitution": "Constitution de la communauté",
  "Read the official rules, regulations, and guidelines that govern the Congolese Students Community and its elections.":
    "Consultez les règles, règlements et directives officiels qui régissent la Communauté des étudiants congolais et ses élections.",
  "Download PDF": "Télécharger le PDF",
  "Please check back later for upcoming elections.": "Veuillez revenir plus tard pour les prochaines élections.",
  "Available Positions": "Postes disponibles",
  "Optional": "Facultatif",
  "Meet the Candidates": "Découvrez les candidats",
  "Learn about the individuals running for leadership positions.": "Découvrez les personnes qui se présentent aux postes de direction.",
  "Check back later for candidate profiles.": "Consultez cette page plus tard pour découvrir les profils des candidats.",
  "Official results verified by the election committee.": "Résultats officiels vérifiés par le comité électoral.",
  "Check back later.": "Consultez cette page plus tard.",
  "Verified by the MKU Community Election Committee.": "Vérifiés par le comité électoral de la communauté MKU.",
  "votes": "voix",
  "Have questions about the election process or need help with your account? Our team is here to assist you.":
    "Vous avez des questions sur le processus électoral ou besoin d'aide avec votre compte ? Notre équipe est là pour vous aider.",
  "We aim to respond within 24 hours.": "Nous nous efforçons de répondre dans les 24 heures.",
  "Mon-Fri, 9:00 AM - 5:00 PM.": "Du lundi au vendredi, de 9 h à 17 h.",
  "Location": "Emplacement",
  "Send us a Message": "Envoyez-nous un message",
  "Everything you need to know about participating in the MKU Community Election. Please read these guidelines carefully to ensure your vote is counted.":
    "Tout ce que vous devez savoir pour participer à l'élection de la communauté MKU. Veuillez lire attentivement ces directives pour que votre vote soit comptabilisé.",
  "Eligibility Criteria": "Critères d'éligibilité",
  "Must be a registered member of the Congolese Students Community at MKU.": "Vous devez être membre inscrit de la Communauté des étudiants congolais de MKU.",
  "Must have an active, approved account on this portal.": "Vous devez disposer d'un compte actif et approuvé sur ce portail.",
  "Must not be suspended by the Election Committee.": "Vous ne devez pas être suspendu par le comité électoral.",
  "Voting Rules": "Règles de vote",
  "Each voter is entitled to exactly": "Chaque électeur a droit à exactement",
  "one ballot": "un bulletin",
  "per election.": "par élection.",
  "Once a ballot is submitted, it cannot be changed or withdrawn.": "Une fois soumis, un bulletin ne peut être modifié ni retiré.",
  "Sharing your login credentials with anyone is strictly prohibited.": "Il est strictement interdit de partager vos identifiants de connexion.",
  "How to Cast Your Vote": "Comment voter",
  "Log In": "Se connecter",
  "Go to the Voter Login page and enter your assigned email and password.": "Accédez à la page de connexion des électeurs et saisissez l'adresse e-mail et le mot de passe qui vous ont été attribués.",
  "Access the Ballot": "Accéder au bulletin",
  "On your dashboard, click 'Vote Now' for the active election.": "Dans votre tableau de bord, cliquez sur « Voter maintenant » pour l'élection en cours.",
  "Review Candidates": "Consulter les candidats",
  "Read through the candidate profiles and manifestos provided on the ballot page.": "Lisez les profils et les programmes des candidats sur la page du bulletin.",
  "Make Your Selection": "Faire votre choix",
  "Select one candidate for each position. Mandatory positions must be filled.": "Choisissez un candidat pour chaque poste. Les postes obligatoires doivent être pourvus.",
  "Submit and Confirm": "Soumettre et confirmer",
  "Review your choices carefully, then click 'Submit Ballot'. A confirmation screen will appear.": "Vérifiez attentivement vos choix, puis cliquez sur « Soumettre le bulletin ». Un écran de confirmation s'affichera.",
  "We are committed to providing a free, fair, and verifiable election. Learn how our technology protects your vote and ensures accurate results.":
    "Nous nous engageons à organiser une élection libre, équitable et vérifiable. Découvrez comment notre technologie protège votre vote et garantit des résultats exacts.",
  "Ballot Data Separation": "Séparation des données du bulletin",
  "Voter participation and ballot selections are stored in separate records. A random ballot reference is used to enforce one ballot per voter, and the same reference is stored with the participation record and the ballot. This separates identity fields from ballot selections, but a person with privileged database access could technically correlate those records; the portal does not claim cryptographic or absolute anonymity against privileged access.":
    "La participation des électeurs et les choix inscrits sur les bulletins sont conservés dans des dossiers distincts. Une référence aléatoire garantit un seul bulletin par électeur ; cette même référence figure dans le dossier de participation et sur le bulletin. Les champs d'identité sont ainsi séparés des choix, mais une personne disposant d'un accès privilégié à la base de données pourrait techniquement relier ces dossiers. Le portail ne garantit donc pas un anonymat cryptographique ou absolu face à un accès privilégié.",
  "See the": "Consultez l'",
  "for details about ballot records and their limitations.": "pour en savoir plus sur les bulletins et leurs limites.",
  "Live Audit Logs": "Journaux d'audit en temps réel",
  "Every action taken by the election administrators—from creating candidates to opening and closing the polls—is logged in an immutable audit trail. This ensures that every administrative action is recorded and reviewable.":
    "Chaque action des administrateurs électoraux, de la création de candidats à l'ouverture et à la clôture du scrutin, est consignée dans un journal d'audit inaltérable. Chaque action administrative est ainsi enregistrée et peut être examinée.",
  "Verification Process": "Processus de vérification",
  "After voting closes, the Election Committee independently calculates the results. The system prevents the publication of results until the committee has formally verified the totals. Results are only made public once this verification is complete.":
    "Après la clôture du vote, le comité électoral calcule les résultats de manière indépendante. Le système empêche leur publication tant que le comité n'a pas officiellement vérifié les totaux. Les résultats ne sont rendus publics qu'une fois cette vérification terminée.",
  "System Integrity": "Intégrité du système",
  "The platform enforces strict database-level constraints. A voter cannot submit more than one ballot, and a ballot cannot contain an invalid candidate or position. The system runs on a secure, privately hosted database.":
    "La plateforme applique des contraintes strictes au niveau de la base de données. Un électeur ne peut pas soumettre plusieurs bulletins et un bulletin ne peut pas contenir un candidat ou un poste invalide. Le système utilise une base de données sécurisée et hébergée de manière privée.",
  "The rules for voter participation, candidate applications, campaigns, election administration, and responsible use of the CECMKU Election Portal.":
    "Les règles relatives à la participation des électeurs, aux candidatures, aux campagnes, à l'administration des élections et à l'utilisation responsable du portail électoral CECMKU.",
  "Privacy Notice": "Avis de confidentialité",
  "Election Policy | CECMKU": "Politique électorale | CECMKU",
  "Privacy Notice | CECMKU": "Avis de confidentialité | CECMKU",
  "How the CECMKU Election Portal handles voter, candidate, ballot, and account information, including important limits on ballot anonymity.":
    "Comment le portail électoral CECMKU traite les informations des électeurs, des candidats, des bulletins et des comptes, y compris les limites importantes de l'anonymat des bulletins.",
  "CECMKU · Community Election Portal": "CECMKU · Portail électoral communautaire",
  "Last updated:": "Dernière mise à jour :",
  "On this page": "Sur cette page",
  "Questions about this information?": "Des questions sur ces informations ?",
  "Contact the election committee": "Contacter le comité électoral",
  "This policy explains the rules for using the CECMKU Election Portal to register, administer, and participate in community elections. It applies to voters, candidate applicants, candidates, and administrators.":
    "Cette politique définit les règles d'utilisation du portail électoral CECMKU pour s'inscrire, administrer et participer aux élections communautaires. Elle s'applique aux électeurs, aux candidats, aux candidats postulants et aux administrateurs.",
  "This policy works alongside the CECMKU Constitution, the current election notice, and any election-specific rules published by the election committee. Where a specific election notice sets a deadline or procedure, follow that notice. The committee should resolve any inconsistency with the governing community documents.":
    "Cette politique complète la Constitution de la CECMKU, l'avis électoral en vigueur et les règles propres à chaque élection publiées par le comité électoral. Si un avis électoral précise une échéance ou une procédure, veuillez le suivre. Le comité doit résoudre toute incohérence avec les documents régissant la communauté.",
  "Voting is limited to eligible CECMKU members with an active, approved portal account and voter profile.":
    "Le vote est réservé aux membres éligibles de la CECMKU disposant d'un compte portail actif et approuvé ainsi que d'un profil d'électeur.",
  "Account registration details must be accurate and belong to the person using the account. Do not impersonate another member, create duplicate accounts, or share login credentials.":
    "Les informations d'inscription au compte doivent être exactes et appartenir à la personne qui l'utilise. N'usurpez pas l'identité d'un autre membre, ne créez pas de comptes en double et ne partagez pas vos identifiants.",
  "An account may be pending until reviewed, suspended if eligibility or security concerns arise, or reactivated after committee review.":
    "Un compte peut rester en attente jusqu'à son examen, être suspendu en cas de problème d'éligibilité ou de sécurité, ou être réactivé après examen par le comité.",
  "Keep your password private, use a device you trust, and sign out when using a shared device. Contact the committee promptly if you suspect account access by another person.":
    "Gardez votre mot de passe confidentiel, utilisez un appareil de confiance et déconnectez-vous après avoir utilisé un appareil partagé. Contactez rapidement le comité si vous pensez qu'une autre personne a accédé à votre compte.",
  "Candidate applications may be submitted before an election has been created. Submission creates a reference number for follow-up; it is not confirmation of eligibility, approval, nomination, or a place on a ballot.":
    "Les candidatures peuvent être soumises avant la création d'une élection. La soumission génère un numéro de référence pour le suivi ; elle ne confirme ni l'éligibilité, ni l'approbation, ni la nomination, ni l'inscription sur un bulletin.",
  "Applicants must provide truthful academic and contact details, identify the position they intend to contest, and submit their own profile and manifesto. The committee may review the application and request clarification or supporting material before making a decision.":
    "Les candidats doivent fournir des informations académiques et de contact exactes, préciser le poste visé et soumettre leur propre profil et programme. Le comité peut examiner la candidature et demander des précisions ou des pièces justificatives avant de prendre une décision.",
  "The portal prevents more than one application using the same registration number within a calendar-year cycle. Contact the committee if you believe a duplicate submission was made in error.":
    "Le portail empêche plusieurs candidatures portant le même numéro d'inscription au cours d'un même cycle annuel. Contactez le comité si vous pensez qu'un doublon a été créé par erreur.",
  "Only applications approved by authorized administrators are added to the candidate roster for election setup.":
    "Seules les candidatures approuvées par des administrateurs autorisés sont ajoutées à la liste des candidats lors de la configuration de l'élection.",
  "Administrators assign approved candidates to election positions. The intended position on an application is considered during assignment.":
    "Les administrateurs affectent les candidats approuvés aux postes électoraux. Le poste indiqué dans la candidature est pris en compte lors de cette affectation.",
  "Once approved, a candidate's profile photograph, biography, and manifesto may be displayed publicly with the candidate listing. Supporting documents remain restricted to authorized administrators.":
    "Une fois la candidature approuvée, la photo de profil, la biographie et le programme du candidat peuvent être affichés publiquement avec sa fiche. Les pièces justificatives restent réservées aux administrateurs autorisés.",
  "Applicants must have the right to provide every uploaded image or document and must not submit unlawful, misleading, abusive, or malicious content.":
    "Les candidats doivent être autorisés à fournir chaque image ou document téléversé et ne doivent pas soumettre de contenu illégal, trompeur, abusif ou malveillant.",
  "Campaigning must follow the Constitution, the current election notice, and committee directions. Candidates and supporters are responsible for keeping campaign communication respectful and based on accurate information.":
    "Les campagnes doivent respecter la Constitution, l'avis électoral en vigueur et les directives du comité. Les candidats et leurs soutiens doivent communiquer avec respect et s'appuyer sur des informations exactes.",
  "Do not buy, sell, coerce, or improperly influence votes, or interfere with another member's ability to participate freely.":
    "N'achetez, ne vendez, ne forcez et n'influencez pas indûment les votes ; ne faites pas obstacle à la libre participation d'un autre membre.",
  "Do not harass, threaten, discriminate against, or impersonate another person.":
    "Ne harcelez, ne menacez, ne discriminez et n'usurpez pas l'identité d'une autre personne.",
  "Do not submit false information, forged documents, another person's photograph, or material you are not authorized to use.":
    "Ne soumettez pas de fausses informations, de faux documents, la photographie d'une autre personne ou du contenu que vous n'êtes pas autorisé à utiliser.",
  "Do not attempt to access another account, bypass eligibility checks, submit multiple ballots, probe or disrupt the portal, or interfere with election records.":
    "Ne tentez pas d'accéder à un autre compte, de contourner les contrôles d'éligibilité, de soumettre plusieurs bulletins, de sonder ou perturber le portail, ni d'interférer avec les dossiers électoraux.",
  "Report suspected security issues or election misconduct to the committee rather than attempting to investigate by accessing data or accounts.":
    "Signalez au comité tout problème de sécurité ou comportement électoral suspect au lieu de tenter d'enquêter en accédant à des données ou à des comptes.",
  "A voter may submit one ballot per election. The portal enforces this using the voter profile and election participation records.":
    "Un électeur peut soumettre un bulletin par élection. Le portail applique cette règle à l'aide du profil de l'électeur et des dossiers de participation.",
  "A ballot can be submitted only while the election is open and within its published voting period. Follow the ballot instructions for mandatory positions and selection limits.":
    "Un bulletin ne peut être soumis que lorsque l'élection est ouverte et pendant la période de vote publiée. Respectez les instructions concernant les postes obligatoires et les limites de sélection.",
  "Review all selections before submitting. A submitted ballot cannot be edited or withdrawn through the portal.":
    "Vérifiez tous vos choix avant de soumettre le bulletin. Un bulletin soumis ne peut être modifié ou retiré via le portail.",
  "Do not ask another person to vote using your account or attempt to learn how an individual voted.":
    "Ne demandez pas à une autre personne de voter avec votre compte et ne tentez pas de découvrir le vote d'un électeur.",
  "If a technical problem prevents submission, contact the committee promptly and include the election name and a description of the issue. Do not send your password or ballot selections in a public channel.":
    "Si un problème technique empêche la soumission, contactez rapidement le comité en indiquant le nom de l'élection et en décrivant le problème. Ne communiquez pas votre mot de passe ni vos choix dans un espace public.",
  "Ballot privacy is described in the Privacy Notice. The portal separates ballot selections from voter profile fields, but it does not currently guarantee that a privileged administrator with database access could not correlate records using the shared ballot reference.":
    "La confidentialité des bulletins est décrite dans l'avis de confidentialité. Le portail sépare les choix des champs du profil électeur, mais ne garantit pas actuellement qu'un administrateur disposant d'un accès privilégié à la base de données ne puisse pas relier les dossiers à l'aide de la référence commune du bulletin.",
  "Authorized administrators manage voter accounts, candidate applications, election schedules, positions, candidate assignments, and results. Administrative actions are recorded in audit logs to support accountability.":
    "Les administrateurs autorisés gèrent les comptes électeurs, les candidatures, les calendriers électoraux, les postes, les affectations de candidats et les résultats. Les actions administratives sont consignées dans des journaux d'audit pour assurer la responsabilité.",
  "The committee may pause, reschedule, close, or otherwise manage an election where required by the Constitution, the election notice, security, or operational circumstances. Any material change should be communicated through an official community channel.":
    "Le comité peut suspendre, reprogrammer, clôturer ou gérer autrement une élection si la Constitution, l'avis électoral, la sécurité ou les circonstances opérationnelles l'exigent. Tout changement important doit être communiqué par un canal officiel de la communauté.",
  "After voting closes, results may be checked and verified before publication. The official published result and the committee's announced process govern; dashboard counts or preliminary information should not be treated as final unless expressly marked official.":
    "Après la clôture du vote, les résultats peuvent être contrôlés et vérifiés avant publication. Le résultat officiel publié et la procédure annoncée par le comité font foi ; les décomptes du tableau de bord et les informations préliminaires ne sont pas définitifs sauf indication officielle explicite.",
  "Raise eligibility questions, suspected duplicate accounts, candidate-application concerns, accessibility problems, or election disputes with the election committee using the contact details on the Contact page. Include the election name and relevant reference number where available, but do not include your password.":
    "Adressez au comité électoral toute question d'éligibilité, suspicion de doublon de compte, préoccupation concernant une candidature, difficulté d'accessibilité ou contestation électorale en utilisant les coordonnées de la page Contact. Indiquez le nom de l'élection et le numéro de référence pertinent, le cas échéant, mais jamais votre mot de passe.",
  "Follow the deadlines and appeal procedure in the applicable election notice or Constitution. The portal does not create a separate appeal deadline or replace those governing procedures.":
    "Respectez les délais et la procédure de recours définis dans l'avis électoral applicable ou la Constitution. Le portail ne fixe pas de délai de recours distinct et ne remplace pas ces procédures.",
  "The portal is provided to support community election administration. Access may be interrupted for maintenance, security response, network conditions, or technical failure. Keep track of published deadlines and contact the committee promptly if an interruption affects your participation.":
    "Le portail facilite l'administration des élections communautaires. L'accès peut être interrompu pour des raisons de maintenance, de sécurité, de réseau ou de défaillance technique. Notez les échéances publiées et contactez rapidement le comité si une interruption affecte votre participation.",
  "The committee may update this policy to reflect changes to the portal or election procedures. The version displayed on this page is the current portal policy; election-specific notices and governing community documents remain important.":
    "Le comité peut mettre à jour cette politique en fonction de l'évolution du portail ou des procédures électorales. La version affichée sur cette page est la politique actuelle du portail ; les avis propres aux élections et les documents régissant la communauté restent également importants.",
  "For questions about this policy or how it applies to a particular election, contact the CECMKU election committee through the portal's Contact page.":
    "Pour toute question sur cette politique ou son application à une élection particulière, contactez le comité électoral de la CECMKU via la page Contact du portail.",
  "The CECMKU election committee administers the portal for community election and membership purposes. Contact the committee through the portal's Contact page to ask questions, request access to information, or raise a privacy concern.":
    "Le comité électoral de la CECMKU administre le portail aux fins des élections communautaires et de la gestion des membres. Contactez-le via la page Contact du portail pour poser une question, demander l'accès à vos informations ou signaler un problème de confidentialité.",
  "The specific organization responsible for data protection decisions and the hosting location can depend on the portal's deployment arrangements. Ask the committee for current operational details if you need them.":
    "L'organisation responsable des décisions relatives à la protection des données et le lieu d'hébergement peuvent dépendre des modalités de déploiement du portail. Si nécessaire, demandez au comité des précisions opérationnelles à jour.",
  "Account information: name, email address, password hash, role, account status, and account creation or update information.":
    "Informations du compte : nom, adresse e-mail, empreinte du mot de passe, rôle, statut du compte et informations relatives à la création ou à la mise à jour du compte.",
  "Voter information: registration/admission number, voter ID, eligibility status, and election participation records.":
    "Informations de l'électeur : numéro d'inscription/admission, identifiant d'électeur, statut d'éligibilité et dossiers de participation aux élections.",
  "Candidate application information: name, registration number, email, phone, faculty or school, department, course, year of study, intended position, biography, manifesto, profile photograph, supporting documents, application reference, and review status.":
    "Informations de candidature : nom, numéro d'inscription, e-mail, téléphone, faculté ou école, département, formation, année d'études, poste visé, biographie, programme, photo de profil, pièces justificatives, référence de candidature et statut d'examen.",
  "Candidate profile information: approved candidate names, photographs, biographies, manifestos, and related election assignments may be displayed on public candidate pages.":
    "Informations du profil candidat : les noms, photos, biographies, programmes et affectations électorales des candidats approuvés peuvent être affichés sur les pages publiques des candidats.",
  "Election records: election and position assignments, ballot submission time, ballot references, selections, and result records.":
    "Dossiers électoraux : élections et affectations aux postes, date de soumission du bulletin, références des bulletins, choix et résultats.",
  "Administration and security records: administrator actions, affected record identifiers, timestamps, and, where configured, related request information such as IP address or browser details.":
    "Dossiers administratifs et de sécurité : actions des administrateurs, identifiants des dossiers concernés, horodatages et, selon la configuration, informations associées aux requêtes telles que l'adresse IP ou les détails du navigateur.",
  "Essential session information used to keep users signed in and protect authenticated areas of the portal.":
    "Informations de session indispensables pour maintenir la connexion des utilisateurs et protéger les espaces authentifiés du portail.",
  "Information is used to create and secure accounts; confirm voter eligibility; receive and review candidate applications; publish approved candidate material; configure elections; prevent duplicate voting; count and verify results; investigate reported issues; maintain audit records; and respond to requests or disputes.":
    "Les informations servent à créer et sécuriser les comptes ; confirmer l'éligibilité des électeurs ; recevoir et examiner les candidatures ; publier les contenus des candidats approuvés ; configurer les élections ; prévenir les votes multiples ; compter et vérifier les résultats ; enquêter sur les problèmes signalés ; tenir les journaux d'audit ; et répondre aux demandes ou contestations.",
  "Passwords are processed for authentication and stored as password hashes rather than as plain-text passwords. Do not send your password to committee members or include it in a support request.":
    "Les mots de passe sont traités à des fins d'authentification et stockés sous forme d'empreintes, et non en texte brut. Ne communiquez pas votre mot de passe aux membres du comité et ne l'incluez pas dans une demande d'assistance.",
  "The portal stores voter participation records separately from the ballot selections. A participation record identifies the voter profile and election and stores a unique ballot reference. A separate ballot record stores that same reference, and selections are attached to the ballot record.":
    "Le portail conserve les dossiers de participation des électeurs séparément des choix exprimés sur les bulletins. Un dossier de participation identifie le profil de l'électeur et l'élection et contient une référence unique de bulletin. Un dossier de bulletin distinct contient cette même référence ainsi que les choix exprimés.",
  "This separation is intended to keep voter identity fields out of the ballot-selection record and to enforce one ballot per voter. However, because the same reference is stored in both records, a person with privileged database access could technically correlate a participation record with its ballot and selections. The current implementation therefore should not be described as providing cryptographic or absolute anonymity against privileged access.":
    "Cette séparation vise à exclure les champs d'identité de l'électeur du dossier contenant ses choix et à garantir un bulletin par électeur. Toutefois, puisque la même référence figure dans les deux dossiers, une personne disposant d'un accès privilégié à la base de données pourrait techniquement relier un dossier de participation au bulletin et aux choix correspondants. La version actuelle ne doit donc pas être présentée comme offrant un anonymat cryptographique ou absolu face à un accès privilégié.",
  "The committee should restrict database and administrator access to authorized people and handle ballot information with care. Voters should not share credentials or attempt to access another person's records.":
    "Le comité doit réserver l'accès à la base de données et aux fonctions d'administration aux personnes autorisées et traiter les informations de vote avec soin. Les électeurs ne doivent pas partager leurs identifiants ni tenter d'accéder aux dossiers d'une autre personne.",
  "Important: although ballot selections are stored separately from voter profile fields, the shared ballot reference can be used to correlate the records by someone with privileged database access.":
    "Important : bien que les choix de vote soient conservés séparément des champs du profil électeur, une personne disposant d'un accès privilégié à la base de données peut utiliser la référence commune pour relier les dossiers.",
  "Candidate application photographs and supporting documents are uploaded for committee review. Application files are stored outside the public web directory and are served through an administrator-authorized route. Supporting documents are not intended for public display.":
    "Les photos et pièces justificatives des candidatures sont téléversées pour examen par le comité. Les fichiers de candidature sont conservés hors du répertoire web public et accessibles par une route réservée aux administrateurs autorisés. Les pièces justificatives ne sont pas destinées à être affichées publiquement.",
  "When an application is approved, the submitted profile photograph may be copied to the public candidate image area so that it can appear on the candidate's public profile. Candidate profile text and manifestos may also be displayed publicly. Do not include private or sensitive information in material intended for a public campaign profile.":
    "Lorsqu'une candidature est approuvée, la photo de profil fournie peut être copiée dans l'espace public des images de candidats afin d'apparaître sur le profil public du candidat. Le texte du profil et le programme peuvent également être affichés publiquement. N'incluez aucune information privée ou sensible dans les contenus destinés au profil public de campagne.",
  "Only upload files you are authorized to provide. The portal accepts specified image formats for profile photographs and PDF files for supporting documents, subject to the upload size limits shown on the application form.":
    "Ne téléversez que des fichiers que vous êtes autorisé à fournir. Le portail accepte certains formats d'image pour les photos de profil et les fichiers PDF pour les pièces justificatives, dans la limite des tailles indiquées sur le formulaire.",
  "Authorized election administrators can access account and election-management information needed for their duties. Authorized administrators can review candidate applications and download supporting files. Public pages show published election information and approved candidate profiles.":
    "Les administrateurs électoraux autorisés peuvent accéder aux informations sur les comptes et la gestion des élections nécessaires à leurs fonctions. Ils peuvent examiner les candidatures et télécharger les pièces justificatives. Les pages publiques présentent les informations électorales publiées et les profils des candidats approuvés.",
  "The portal does not use candidate or voter information for advertising or sell personal information. Information may be processed by the hosting, database, or file-storage services configured for the deployment, by technical support personnel when necessary to maintain the portal, or where disclosure is required to address a security incident or comply with an applicable legal obligation.":
    "Le portail n'utilise pas les informations des candidats ou des électeurs à des fins publicitaires et ne vend pas de données personnelles. Les informations peuvent être traitées par les services d'hébergement, de base de données ou de stockage de fichiers configurés pour le déploiement, par le personnel d'assistance technique lorsque cela est nécessaire à la maintenance du portail, ou lorsque leur divulgation est nécessaire pour traiter un incident de sécurité ou respecter une obligation légale applicable.",
  "Portal records are stored in the configured MySQL database and application file storage. The actual storage location depends on the environment in which the portal is deployed.":
    "Les dossiers du portail sont conservés dans la base de données MySQL configurée et dans le stockage de fichiers de l'application. L'emplacement réel dépend de l'environnement de déploiement du portail.",
  "Information is retained for as long as reasonably needed to administer accounts and elections, verify results, handle disputes, maintain audit and election-integrity records, and meet applicable obligations. The portal does not currently publish a fixed deletion period for each category. Contact the committee to ask about a specific record or the current retention arrangements.":
    "Les informations sont conservées aussi longtemps que raisonnablement nécessaire pour gérer les comptes et les élections, vérifier les résultats, traiter les litiges, maintenir les dossiers d'audit et d'intégrité électorale et respecter les obligations applicables. Le portail ne publie pas actuellement de durée de suppression fixe pour chaque catégorie. Contactez le comité pour toute question sur un dossier précis ou les modalités de conservation actuelles.",
  "A request to delete or change information may be limited where the record is needed to preserve a submitted ballot, election history, audit trail, or the integrity of a result. The committee should explain any applicable limitation when responding to a request.":
    "Une demande de suppression ou de modification peut être limitée si le dossier est nécessaire à la conservation d'un bulletin soumis, de l'historique électoral, du journal d'audit ou de l'intégrité d'un résultat. Le comité doit expliquer toute restriction applicable dans sa réponse.",
  "The portal uses authentication, role checks for administrative functions, database constraints, audit records, and restricted file routes to help protect information. No website or storage system can be guaranteed completely secure. Access is limited to the controls available in the deployed environment.":
    "Le portail utilise l'authentification, des vérifications de rôle pour les fonctions administratives, des contraintes de base de données, des journaux d'audit et des routes de fichiers restreintes pour protéger les informations. Aucun site web ni système de stockage ne peut être garanti totalement sécurisé. L'accès est limité aux mécanismes de contrôle disponibles dans l'environnement déployé.",
  "Essential session cookies may be used to maintain sign-in and protect portal functions. The current site does not provide a separate advertising-cookie preference center. Avoid using shared or untrusted devices for voting, and sign out after use.":
    "Des témoins de session essentiels peuvent être utilisés pour maintenir la connexion et protéger les fonctions du portail. Le site actuel ne propose pas de centre de préférences distinct pour les témoins publicitaires. Évitez les appareils partagés ou non fiables pour voter et déconnectez-vous après utilisation.",
  "If you suspect that an account or candidate file has been accessed improperly, contact the committee promptly through the Contact page. Do not send passwords or ballot selections in an unprotected message.":
    "Si vous pensez qu'un compte ou un fichier de candidat a été consulté de manière inappropriée, contactez rapidement le comité via la page Contact. N'envoyez pas de mot de passe ni de choix de vote dans un message non protégé.",
  "You may ask the committee to confirm what information is held about you, correct inaccurate account or application details, or explain how a record is being used. Provide enough information to identify your account or application, such as your application reference, but do not send your password.":
    "Vous pouvez demander au comité de confirmer les informations détenues à votre sujet, de corriger les informations inexactes de votre compte ou de votre candidature, ou d'expliquer l'utilisation d'un dossier. Fournissez assez d'informations pour identifier votre compte ou votre candidature, par exemple la référence de candidature, mais ne communiquez pas votre mot de passe.",
  "Requests to erase, restrict, or change records are considered in light of applicable rules and the need to preserve voting integrity, submitted ballots, election results, and audit records. Candidate applicants may contact the committee to ask about withdrawing an application before it is used in election setup.":
    "Les demandes d'effacement, de restriction ou de modification des dossiers sont examinées au regard des règles applicables et de la nécessité de préserver l'intégrité du vote, les bulletins soumis, les résultats électoraux et les journaux d'audit. Les candidats peuvent contacter le comité pour demander le retrait de leur candidature avant son utilisation dans la configuration d'une élection.",
  "Where you have a concern about how information is handled, contact the committee first. Any rights or complaint routes available under applicable data-protection law remain unaffected by this notice.":
    "Si vous avez une préoccupation concernant le traitement de vos informations, contactez d'abord le comité. Le présent avis ne limite aucun droit ni recours prévu par la législation applicable en matière de protection des données.",
  "This notice may be updated when portal features, election procedures, or deployment arrangements change. The latest version and its update date will be shown on this page. Material changes should be communicated through an appropriate CECMKU channel.":
    "Le présent avis peut être mis à jour en cas de modification des fonctionnalités du portail, des procédures électorales ou des modalités de déploiement. La dernière version et sa date de mise à jour seront affichées sur cette page. Les changements importants doivent être communiqués par un canal CECMKU approprié.",
  "For privacy questions or requests, contact the CECMKU election committee through the portal's Contact page. Include the relevant account or candidate application reference when appropriate.":
    "Pour toute question ou demande relative à la confidentialité, contactez le comité électoral de la CECMKU via la page Contact du portail. Le cas échéant, indiquez la référence pertinente de votre compte ou de votre candidature.",
  "Close admin navigation": "Fermer la navigation administrateur",
  "Open admin navigation": "Ouvrir la navigation administrateur",
  "Admin navigation": "Navigation administrateur",
  "Support & Transparency": "Assistance et transparence",
  "Primary navigation": "Navigation principale",
  "Mobile navigation": "Navigation mobile",
  "Please review your selections carefully before submitting.": "Veuillez vérifier attentivement vos choix avant de soumettre votre bulletin.",
  "Candidate": "Candidat",
  "Position TBD": "Poste à déterminer",
  "Election Status": "Statut de l'élection",
  "Election and Acceptable Use Policy": "Politique électorale et d'utilisation acceptable",
  "November 18, 2026": "18 novembre 2026",
  "John Doe": "Jean Dupont",
  "john@example.com": "jean@exemple.com",
  "How can we help?": "Comment pouvons-nous vous aider ?",
  "Write your message here...": "Écrivez votre message ici...",
  "Search name, reference, email, or position": "Rechercher par nom, référence, e-mail ou poste",
  "Create Election": "Créer une élection",
  "Registered Voters": "Électeurs inscrits",
  "Candidates": "Candidats",
  "Results Not Yet Published": "Résultats pas encore publiés",
  "Total Voter Turnout:": "Nombre total de votants :",
  "No Active Election": "Aucune élection en cours",
  "No active election at the moment.": "Aucune élection n'est en cours pour le moment.",
  "No candidates for this position.": "Aucun candidat pour ce poste.",
  "No candidates announced yet": "Aucun candidat annoncé pour le moment",
  "Edit voter": "Modifier l'électeur",
  "Delete voter": "Supprimer l'électeur",
  "Search name, email, or ID": "Rechercher par nom, e-mail ou identifiant",
  "Election Details": "Détails de l'élection",
  "Candidate Registration": "Inscription des candidats",
  "Election Results": "Résultats de l'élection",
  "Contact the Committee": "Contacter le comité",
  "Full Name": "Nom complet",
  "Full name": "Nom complet",
  "Password": "Mot de passe",
  "Forgot?": "Oublié ?",
  "Registration number": "Numéro d'inscription",
  "Please select a candidate for all mandatory positions": "Veuillez choisir un candidat pour tous les postes obligatoires",
  "Delete this voter account? Accounts with voting records are protected.":
    "Supprimer ce compte électeur ? Les comptes associés à des votes sont protégés.",
  "1. Purpose and scope": "1. Objet et champ d'application",
  "2. Eligibility and accounts": "2. Éligibilité et comptes",
  "3. Candidate applications and campaign information": "3. Candidatures et informations de campagne",
  "4. Campaign conduct and acceptable use": "4. Conduite de campagne et utilisation acceptable",
  "5. Voting rules and ballot submission": "5. Règles de vote et soumission du bulletin",
  "6. Election administration and results": "6. Administration des élections et résultats",
  "7. Questions, disputes, and complaints": "7. Questions, litiges et réclamations",
  "8. Availability and policy changes": "8. Disponibilité et modifications de la politique",
  "9. Contact": "9. Contact",
  "1. Who administers this information": "1. Responsable du traitement des informations",
  "2. Information the portal handles": "2. Informations traitées par le portail",
  "3. How information is used": "3. Utilisation des informations",
  "4. Ballot records and privacy limitations": "4. Dossiers de vote et limites de confidentialité",
  "5. Candidate applications, files, and public display": "5. Candidatures, fichiers et affichage public",
  "6. Who can access information": "6. Personnes autorisées à accéder aux informations",
  "7. Storage and retention": "7. Stockage et conservation",
  "8. Security and cookies": "8. Sécurité et témoins de connexion",
  "9. Your choices and requests": "9. Vos choix et demandes",
  "10. Changes to this notice": "10. Modifications du présent avis",
  "11. Privacy contact": "11. Contact relatif à la confidentialité",
  "CECMKU Registration": "Inscription CECMKU",
  "← Candidate registrations": "← Candidatures",
  "Review": "Examiner",
  "CECMKU Admin": "Administration CECMKU",
  "Voting has officially ended.": "Le vote est officiellement terminé.",
  "Waiting for administrator to verify and publish results.":
    "En attente de la vérification et de la publication des résultats par l'administrateur.",
  "MB)": "Mo)",
  "Our goal is to provide a seamless digital voting experience that protects the integrity of every ballot. Voter profile fields are stored separately from ballot selections, although shared ballot references may allow privileged database users to correlate records.":
    "Notre objectif est d'offrir une expérience de vote numérique fluide qui protège l'intégrité de chaque bulletin. Les champs du profil électeur sont conservés séparément des choix exprimés, bien que les références communes puissent permettre aux utilisateurs privilégiés de la base de données de relier les dossiers.",
  "Ballot Record Separation": "Séparation des dossiers de vote",
  "Voter profile fields are stored separately from ballot selections; shared references may still permit correlation by privileged database users.":
    "Les champs du profil électeur sont conservés séparément des choix exprimés ; les références communes peuvent toutefois permettre aux utilisateurs privilégiés de la base de données de relier les dossiers.",
  "Separate records": "Dossiers séparés",
  "Every action taken by the election administrators—from creating candidates to opening and closing the polls—is logged in an audit trail. This ensures that every administrative action is recorded and reviewable.":
    "Chaque action des administrateurs électoraux, de la création de candidats à l'ouverture et à la clôture du scrutin, est consignée dans un journal d'audit. Chaque action administrative est ainsi enregistrée et peut être examinée.",
  "Invalid voter.": "Électeur invalide.",
  "This account is not a pending voter.": "Ce compte n'est pas celui d'un électeur en attente.",
  "Failed to approve voter.": "Échec de l'approbation de l'électeur.",
  "Position could not be created.": "Impossible de créer le poste.",
  "Candidate assignment could not be completed.": "Impossible d'affecter le candidat.",
  "Invalid form data": "Données de formulaire invalides.",
  "The candidate photo must be JPG, PNG, or WebP.": "La photo du candidat doit être au format JPG, PNG ou WebP.",
  "The candidate photo must not exceed 5 MB.": "La photo du candidat ne doit pas dépasser 5 Mo.",
  "A candidate with this registration number already exists.": "Un candidat portant ce numéro d'inscription existe déjà.",
  "Failed to create candidate. Please try again.": "Échec de la création du candidat. Veuillez réessayer.",
  "Please review the form and correct the highlighted information.": "Veuillez vérifier le formulaire et corriger les informations indiquées.",
  "Please upload a profile photograph.": "Veuillez téléverser une photo de profil.",
  "The profile photograph must be 5 MB or smaller.": "La photo de profil ne doit pas dépasser 5 Mo.",
  "You can upload a maximum of five supporting documents.": "Vous pouvez téléverser au maximum cinq pièces justificatives.",
  "The profile photo must be a valid JPEG, PNG, or WebP image.": "La photo de profil doit être une image JPEG, PNG ou WebP valide.",
  "Supporting documents must be valid PDF files.": "Les pièces justificatives doivent être des fichiers PDF valides.",
  "An application for this registration number has already been submitted for this election cycle.":
    "Une candidature portant ce numéro d'inscription a déjà été soumise pour ce cycle électoral.",
  "Your application could not be submitted. Please try again.": "Votre candidature n'a pas pu être soumise. Veuillez réessayer.",
  "Please check the application fields.": "Veuillez vérifier les champs de la candidature.",
  "Could not update this application. Check for duplicate registration numbers.":
    "Impossible de mettre à jour cette candidature. Vérifiez qu'il n'y a pas de numéro d'inscription en double.",
  "Invalid application.": "Candidature invalide.",
  "Application not found.": "Candidature introuvable.",
  "Could not update the application status.": "Impossible de mettre à jour le statut de la candidature.",
  "The voting period must start in the future.": "La période de vote doit commencer à une date future.",
  "Failed to create election.": "Échec de la création de l'élection.",
  "Invalid election details.": "Détails de l'élection invalides.",
  "The end date must be after the start date.": "La date de fin doit être postérieure à la date de début.",
  "Election not found.": "Élection introuvable.",
  "Open and completed elections cannot be edited.": "Les élections ouvertes ou terminées ne peuvent pas être modifiées.",
  "Failed to update election.": "Échec de la mise à jour de l'élection.",
  "Positions can only be changed while an election is a draft.": "Les postes ne peuvent être modifiés que lorsque l'élection est à l'état de brouillon.",
  "Failed to create position. It may already exist.": "Échec de la création du poste. Il existe peut-être déjà.",
  "Invalid data": "Données invalides.",
  "Election, position, or candidate not found.": "Élection, poste ou candidat introuvable.",
  "Candidates can only be assigned while an election is a draft.": "Les candidats ne peuvent être affectés que lorsque l'élection est à l'état de brouillon.",
  "The selected position does not belong to this election.": "Le poste sélectionné n'appartient pas à cette élection.",
  "Only active candidates can be assigned to an election.": "Seuls les candidats actifs peuvent être affectés à une élection.",
  "Candidate is already assigned to this position.": "Ce candidat est déjà affecté à ce poste.",
  "Invalid election status.": "Statut d'élection invalide.",
  "The election status changed. Refresh and try again.": "Le statut de l'élection a changé. Actualisez la page et réessayez.",
  "Failed to update status.": "Échec de la mise à jour du statut.",
  "Invalid election.": "Élection invalide.",
  "Active or scheduled elections cannot be deleted.": "Les élections en cours ou programmées ne peuvent pas être supprimées.",
  "This election has voting or result records and cannot be deleted.":
    "Cette élection contient des votes ou des résultats et ne peut pas être supprimée.",
  "Failed to delete election.": "Échec de la suppression de l'élection.",
  "A user with this email, voter ID, or registration number already exists.":
    "Un utilisateur avec cette adresse e-mail, cet identifiant d'électeur ou ce numéro d'inscription existe déjà.",
  "Failed to create voter. Please try again.": "Échec de la création de l'électeur. Veuillez réessayer.",
  "Voter not found.": "Électeur introuvable.",
  "The email, voter ID, or registration number is already in use.":
    "L'adresse e-mail, l'identifiant d'électeur ou le numéro d'inscription est déjà utilisé.",
  "Failed to update voter.": "Échec de la mise à jour de l'électeur.",
  "Voter account not found.": "Compte électeur introuvable.",
  "You cannot delete your own account.": "Vous ne pouvez pas supprimer votre propre compte.",
  "This voter has election records and cannot be deleted. Suspend the account instead.":
    "Cet électeur a des dossiers électoraux et ne peut pas être supprimé. Suspendez plutôt son compte.",
  "Failed to change voter status.": "Échec de la modification du statut de l'électeur.",
  "Failed to delete voter.": "Échec de la suppression de l'électeur.",
  "Registration submitted! Please wait for admin approval.": "Inscription envoyée ! Veuillez attendre l'approbation de l'administration.",
  "Failed to submit registration. Please try again.": "Échec de l'envoi de l'inscription. Veuillez réessayer.",
  "Results can only be calculated after voting has closed.": "Les résultats ne peuvent être calculés qu'après la clôture du vote.",
  "Failed to calculate results. Refresh and try again.": "Échec du calcul des résultats. Actualisez la page et réessayez.",
  "Calculate results before publishing them.": "Calculez les résultats avant de les publier.",
  "Failed to publish results. Refresh and try again.": "Échec de la publication des résultats. Actualisez la page et réessayez.",
  "The ballot contains invalid or duplicate selections.": "Le bulletin contient des choix invalides ou en double.",
  "Voting is currently closed for this election.": "Le vote est actuellement clôturé pour cette élection.",
  "Please select a candidate for every mandatory position.": "Veuillez choisir un candidat pour chaque poste obligatoire.",
  "A selected candidate is not active in this election position.": "Un candidat sélectionné n'est pas actif pour ce poste dans cette élection.",
  "You have already submitted a ballot for this election.": "Vous avez déjà soumis un bulletin pour cette élection.",
  "Your account is not eligible to vote.": "Votre compte n'est pas autorisé à voter.",
  "Failed to submit ballot. Please try again.": "Échec de la soumission du bulletin. Veuillez réessayer.",
  "We're here to help": "Nous sommes là pour vous aider",
  "Get in Touch": "Contactez-nous",
  "Have questions about the election process, need assistance with your account, or require more information? Reach out to our team through any of the channels below.":
    "Vous avez des questions sur le processus électoral, besoin d'aide avec votre compte ou besoin de plus d'informations ? Contactez notre équipe par l'un des canaux ci-dessous.",
  "Call or WhatsApp": "Appeler ou envoyer un WhatsApp",
  "Speak directly with our team or send us a message on WhatsApp.":
    "Parlez directement avec notre équipe ou envoyez-nous un message sur WhatsApp.",
  "Call Now": "Appeler maintenant",
  "Email Us": "Envoyez-nous un e-mail",
  "For general inquiries, election-related questions, or assistance, send us an email.":
    "Pour toute demande générale, question liée aux élections ou assistance, envoyez-nous un e-mail.",
  "Send an Email": "Envoyer un e-mail",
  "Our Location": "Notre emplacement",
  "Mount Kenya University": "Université Mount Kenya",
  "Thika, Kenya": "Thika, Kenya",
  "Contact Availability": "Disponibilité",
  "Contact us by phone, WhatsApp, or email.":
    "Contactez-nous par téléphone, WhatsApp ou e-mail.",
  "Our team will respond as soon as possible.":
    "Notre équipe vous répondra dès que possible.",
  "We're Ready to Assist You": "Nous sommes prêts à vous aider",
  "Your questions and concerns matter. Get in touch with us and let us help you navigate the election process.":
    "Vos questions et préoccupations comptent. Contactez-nous et laissez-nous vous accompagner tout au long du processus électoral.",
  "Chat With Us": "Discuter avec nous",
};

const originalText = new WeakMap<Text, string>();
const lastAppliedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const lastAppliedAttributes = new WeakMap<Element, Map<string, string>>();
const originalPageTitles = new WeakMap<HTMLTitleElement, { original: string; translated: string }>();
const frenchMonths = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const englishMonths: Record<string, { full: string; short: string }> = {
  January: { full: "janvier", short: "janv." },
  February: { full: "février", short: "févr." },
  March: { full: "mars", short: "mars" },
  April: { full: "avril", short: "avr." },
  May: { full: "mai", short: "mai" },
  June: { full: "juin", short: "juin" },
  July: { full: "juillet", short: "juil." },
  August: { full: "août", short: "août" },
  September: { full: "septembre", short: "sept." },
  October: { full: "octobre", short: "oct." },
  November: { full: "novembre", short: "nov." },
  December: { full: "décembre", short: "déc." },
  Jan: { full: "janvier", short: "janv." },
  Feb: { full: "février", short: "févr." },
  Mar: { full: "mars", short: "mars" },
  Apr: { full: "avril", short: "avr." },
  Jun: { full: "juin", short: "juin" },
  Jul: { full: "juillet", short: "juil." },
  Aug: { full: "août", short: "août" },
  Sep: { full: "septembre", short: "sept." },
  Oct: { full: "octobre", short: "oct." },
  Nov: { full: "novembre", short: "nov." },
  Dec: { full: "décembre", short: "déc." },
};

function translateEnglishDate(value: string): string {
  const numericDate = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (numericDate) {
    const month = Number(numericDate[1]);
    if (month >= 1 && month <= 12) {
      return `${Number(numericDate[2])} ${frenchMonths[month - 1]} ${numericDate[3]}`;
    }
  }

  let hasDate = false;
  const translated = value.replace(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(?:st|nd|rd|th)?(,?\s+\d{4})?\b/g,
    (_match, month: string, day: string, year: string | undefined) => {
      hasDate = true;
      const monthTranslation = englishMonths[month];
      const monthName = month.length > 3 ? monthTranslation.full : monthTranslation.short;
      const yearText = year?.replace(/[^\d]/g, "");
      return `${day} ${monthName}${yearText ? ` ${yearText}` : ""}`;
    }
  );
  if (!hasDate) return value;

  return translated
    .replace(/\s+at\s+/gi, " à ")
    .replace(/\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/gi, (_, hour: string, minute: string, period: string) => {
      const numericHour = Number(hour) % 12 + (period.toUpperCase() === "PM" ? 12 : 0);
      return `${String(numericHour).padStart(2, "0")} h ${minute}`;
    });
}

export function getTranslation(value: string, language: Language): string {
  const trimmed = value.trim();
  const footer = language === "fr"
    ? trimmed.match(/^(© \d{4} CECMKU \(Communauté des Étudiants Congolais à MKU\)\. )All rights reserved\.$/)
    : null;
  const translated = language !== "fr"
    ? trimmed
    : footer
      ? `${footer[1]}Tous droits réservés.`
      : translations[trimmed] ?? translateEnglishDate(trimmed);
  return value.replace(trimmed, translated);
}

export function translateCurrentLanguage(value: string): string {
  const language: Language = document.documentElement.lang === "fr" ? "fr" : "en";
  return getTranslation(value, language);
}

function translatePageTitle(language: Language) {
  const titleElement = document.head.querySelector("title");
  if (!titleElement) return;

  const current = titleElement.textContent ?? "";
  let title = originalPageTitles.get(titleElement);
  if (!title || current !== title.translated) {
    title = { original: current, translated: current };
    originalPageTitles.set(titleElement, title);
  }

  const translated = getTranslation(title.original, language);
  if (current !== translated) titleElement.textContent = translated;
  originalPageTitles.set(titleElement, { original: title.original, translated });
}

function translateText(language: Language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }

  textNodes.forEach((textNode) => {
    const currentText = textNode.textContent ?? "";
    if (!originalText.has(textNode) || (lastAppliedText.has(textNode) && currentText !== lastAppliedText.get(textNode))) {
      originalText.set(textNode, currentText);
    }
    const original = originalText.get(textNode) ?? "";
    if (!original.trim()) return;
    const nextText = getTranslation(original, language);
    if (currentText !== nextText) textNode.textContent = nextText;
    lastAppliedText.set(textNode, nextText);
  });

  document.querySelectorAll("[placeholder], [title], [aria-label], img[alt]").forEach((element) => {
    const attributes = ["placeholder", "title", "aria-label", "alt"];
    let originals = originalAttributes.get(element);
    let lastApplied = lastAppliedAttributes.get(element);
    if (!originals) {
      originals = new Map<string, string>();
      originalAttributes.set(element, originals);
    }
    if (!lastApplied) {
      lastApplied = new Map<string, string>();
      lastAppliedAttributes.set(element, lastApplied);
    }

    attributes.forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (current === null) return;
      if (!originals?.has(attribute) || (lastApplied?.has(attribute) && current !== lastApplied.get(attribute))) {
        originals?.set(attribute, current);
      }
      const original = originals?.get(attribute) ?? current;
      const translated = getTranslation(original, language);
      if (current !== translated) element.setAttribute(attribute, translated);
      lastApplied?.set(attribute, translated);
    });
  });
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => undefined,
});

export function useLanguage() {
  return useContext(LanguageContext);
}


export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("cecmku-language");

    if (storedLanguage === "fr" || storedLanguage === "en") {
      document.documentElement.lang = storedLanguage;
      translateText(storedLanguage);
      translatePageTitle(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("cecmku-language", language);

    translateText(language);
    translatePageTitle(language);

    const observer = new MutationObserver(() => translateText(language));

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
      childList: true,
      subtree: true,
      characterData: true,
    });

    const titleObserver = new MutationObserver(() =>
      translatePageTitle(language)
    );

    titleObserver.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      titleObserver.disconnect();
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
