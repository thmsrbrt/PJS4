DROP TABLE IF EXISTS Postule;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Conversation;
DROP TABLE IF EXISTS Candidature;
DROP TABLE IF EXISTS Annonce;
DROP TABLE IF EXISTS Entreprise;
DROP TABLE IF EXISTS Utilisateur;

#------------------------------------------------------------
# Table: Utilisateur
#------------------------------------------------------------

CREATE TABLE Utilisateur(
                            idUtilisateur Int  Auto_increment  NOT NULL ,
                            Nom        Varchar (255) NOT NULL ,
                            Prenom     Varchar (255)  ,
                            Email      Varchar (255) NOT NULL ,
                            MotDePasse Varchar (1000) NOT NULL ,
                            token VARCHAR (255),
                            tokenTimeStamp integer,
                            PhotoProfile       Varchar (255) NOT NULL ,
                            Description Varchar (1000) ,
                            CVFile      Varchar (255) ,
                            Type        VARCHAR(32) NOT NULL

    ,CONSTRAINT Utilisateur_PK PRIMARY KEY (idUtilisateur)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Annonce
#------------------------------------------------------------

CREATE TABLE Annonce(
                        idAnnonce   Int  Auto_increment  NOT NULL ,
                        Titre       Varchar (255) NOT NULL ,
                        Image       Varchar (255) ,
                        Description Varchar (1000) NOT NULL ,
                        NbCandidat      Int NOT NULL ,
                        idEntreprise  Int NOT NULL
    ,CONSTRAINT Annonce_PK PRIMARY KEY (idAnnonce)

    ,CONSTRAINT Annonce_Entreprise_FK FOREIGN KEY (idEntreprise) REFERENCES Utilisateur(idUtilisateur)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Conversation
#------------------------------------------------------------

CREATE TABLE Conversation(
                             idConversation     Int NOT NULL ,
                             idUtilisateurA Int NOT NULL ,
                             idUtilisateurB Int NOT NULL ,
                             Libelle        Varchar (32) NOT NULL ,
                             idAnnonce      Int
    -- ,CONSTRAINT Conversation_AK PRIMARY KEY (idUtilisateurA,idUtilisateurB)
    ,CONSTRAINT Conversation_PK PRIMARY KEY (idConversation)
    ,CONSTRAINT ConvUserA_UserB_Unique UNIQUE (idUtilisateurA, idUtilisateurB)

    -- ,CONSTRAINT Conversation_Utilisateur_FK FOREIGN KEY (idCandidat) REFERENCES Utilisateur(idCandidat)
    ,CONSTRAINT Conversation_UtilisateurA_FK FOREIGN KEY (idUtilisateurA) REFERENCES Utilisateur(idUtilisateur)
    ,CONSTRAINT Conversation_UtilisateurB_FK FOREIGN KEY (idUtilisateurB) REFERENCES Utilisateur(idUtilisateur)
    ,CONSTRAINT Conversation_Annonce0_FK FOREIGN KEY (idAnnonce) REFERENCES Annonce(idAnnonce)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Message
#------------------------------------------------------------

CREATE TABLE Message(
                        idMessage     Int  Auto_increment  NOT NULL ,
                        Message       Varchar (1000) NOT NULL , -- contenu du message
                        DateEnvoi     DATE NOT NULL, -- Date d'envoi du message
                        idUtilisateur Int NOT NULL, -- utilisateur qui a envoyé le  -- vérifier que c'est userA ou userB avec trigger
                        idConversation Int NOT NULL
    ,CONSTRAINT Message_PK PRIMARY KEY (idMessage)

    ,CONSTRAINT Message_Utilisateur_PK FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(idUtilisateur)
    ,CONSTRAINT Message_Conversation_FK FOREIGN KEY (idConversation) REFERENCES Conversation(idConversation) -- probleme avec reference, il faut que ce soit usera ou userb mais pas les 2 ni user tout cours
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Candidature
#------------------------------------------------------------

CREATE TABLE Candidature(
                            idCandidature    Int  Auto_increment  NOT NULL ,
                            CVfile           Varchar (255) NOT NULL ,
                            LettreMotivation Varchar (2000) ,
                            idCandidat       Int NOT NULL ,
                            idAnnonce        Int NOT NULL
    ,CONSTRAINT Candidature_PK PRIMARY KEY (idCandidature)

    ,CONSTRAINT Candidature_Candidat_FK FOREIGN KEY (idCandidat) REFERENCES Utilisateur(idUtilisateur)
    ,CONSTRAINT Candidature_Annonce0_FK FOREIGN KEY (idAnnonce) REFERENCES Annonce(idAnnonce)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Vues: Utilisateurs (candidat, entreprise)
#------------------------------------------------------------

CREATE OR REPLACE VIEW V_Candidat AS
    SELECT Utilisateur.idUtilisateur,Utilisateur.Prenom,Utilisateur.Nom,Utilisateur.Email,Utilisateur.MotDePasse,
           Utilisateur.PhotoProfile,Utilisateur.Description,Utilisateur.CVFile,Utilisateur.Type FROM Utilisateur
        WHERE Type = 'Candidat';

CREATE OR REPLACE VIEW V_Entreprise AS
    SELECT Utilisateur.idUtilisateur,Utilisateur.Nom,Utilisateur.Email,Utilisateur.MotDePasse,
           Utilisateur.PhotoProfile,Utilisateur.Type FROM Utilisateur
        WHERE Type = 'Entreprise';


#------------------------------------------------------------
# Triggers:
#------------------------------------------------------------

-- CREATE OR REPLACE TRIGGER T_IncrementeNbCandidature -- (mariaDB)
DROP TRIGGER IF EXISTS T_IncrementeNbCandidature; -- (mySql)
CREATE TRIGGER T_IncrementeNbCandidature -- (mySql)
    AFTER INSERT ON Candidature
    FOR EACH ROW
    BEGIN
       UPDATE Annonce SET NbCandidat = NbCandidat + 1
       WHERE Annonce.idAnnonce = NEW.IdAnnonce;
    end;


#------------------------------------------------------------
# Inserts:
#------------------------------------------------------------

INSERT INTO Utilisateur(idUtilisateur, Prenom, Nom, Email, MotDePasse, PhotoProfile, Description, CVFile, Type)
VALUES (1, 'Thomas', 'Robert', 'thomas.robert@icoud.com', 'thomas1234', '/Image/PhotoProfile/thomas.png', 'thomas fait une présentation de lui meme blablabla. ','/file/CVCandidat/thomas.pdf', 'Candidat'),
       (2, 'Thomas', 'Robert', 'thomas.robert@gmail.com', '(thz83.ghzis;', '/Image/PhotoProfile/robert.png', 'znjdnznskd','/file/CVCandidat/thomas.pdf', 'Candidat'),
       (3, 'Laurent', 'Ngeth', 'laurent.ngeth@icoud.com', 'motdepasse', '/Image/PhotoProfile/laurent.png', 'laurentlaurent laurent laurent laurentlaurentlaurentlaurent','/file/CVCandidat/laurent.pdf', 'Candidat'),
       (4, 'Florian', 'Le gal', 'flo.le.gal234@icoud.com', 'trtrterzrez', '/Image/PhotoProfile/flo.png', 'le mec qui a un stage','/file/CVCandidat/flo.pdf', 'Candidat'),
       (5, 'Ayoub', 'saispas', 'ayoub23456@gmail.com', 'root1234', '/Image/PhotoProfile/ayoub.png', 'znjdnznskd','/file/CVCandidat/ayoub.pdf', 'Candidat'),
       (6, 'Youcef', 'saispas', 'Youcef.youcef93@icoud.c', 'é/RTZJN(iuzdj4knfqd;.a@hea789er-ae', '/Image/PhotoProfile/youcef.png', 'le mec avec un mot de passe fort','/file/CVCandidat/youcef.pdf', 'Candidat'),
       (7, 'Fabien', 'Rondan', 'fabien.rondan@protonmail.com', 'password1234', '/Image/PhotoProfile/fab.png', 'znjdnznskd','/file/CVCandidat/fab.pdf', 'Candidat'),
       (8, 'Fabien', 'Rondan', 'fabiendu56334@icoud.c', 'trtrterzrez', '/Image/PhotoProfile/fab.png', 'je dois te rendre ta souris je crois','/file/CVCandidat/fab.pdf', 'Candidat'),
       (9, 'Nahean', 'saisplus', 'nahean543@icoud.c', 'trtrterzrez', '/Image/PhotoProfile/nahean.png', 'fait que blablater','/file/CVCandidat/nahean.pdf', 'Candidat'),
       (10, 'Quentin', 'Robert', 'quentin.robert@gmail.com', 'quentinrobert', '/Image/PhotoProfile/qt.png', 'qt qt qt moi je serais medecin généraliste et rien d\'autre AVEC UNE APOSTROPHE ','/file/CVCandidat/qt.pdf', 'Candidat');

INSERT INTO Utilisateur(idUtilisateur, Nom, Email, MotDePasse, PhotoProfile, Type)
VALUES (11, 'Airbus group', 'recruteur@airbus.fr', 'dfghjhgfds','/Image/PhotoEntreprise/airbusGroup.png', 'Entreprise'),
       (12, 'Alstom', 'recrutement@alstom.fr', 'dfghjhgfds','/Image/PhotoEntreprise/Alstom.png', 'Entreprise'),
       (113, 'Axa', 'carrer@axa.fr', 'dfghjhgfds','/Image/PhotoEntreprise/Axa.png', 'Entreprise'),
       (14,'bnp paribas', 'recrutement@bnp-paribas.fr', 'dfghjhgfds','/Image/PhotoEntreprise/bnp-paribas.png', 'Entreprise'),
       (15, 'Bouygues', 'recrutement@bouyge.fr', 'dfghjhgfds','/Image/PhotoEntreprise/bouygues.png', 'Entreprise'),
       (416, 'engie', 'carrer@engie.fr', 'dfghjhgfds','/Image/PhotoEntreprise/engie.png', 'Entreprise'),
       (17, 'michelin', 'recruteur@michelin.fr', 'dfghjhgfds','/Image/PhotoEntreprise/michelin.png', 'Entreprise'),
       (18, 'stellantis', 'recrutement@stellantis.fr', 'dfghjhgfds', '/Image/PhotoEntreprise/stellantis.png', 'Entreprise');

INSERT INTO Annonce(idAnnonce, Titre, Image, Description, NbCandidat, idEntreprise)
VALUES (1, 'stage developer java', null, 'airbus satge java bac+45', 0, 11), -- pourquoi il ya un idcandidat ? je trouve pas sa logique -- nbcandidat = 3 apres insert
       (3, 'stage test python', null, 'stellantis bac+34 minimum ecole d\'ingénieur du future', 100, 18),
       (10, 'stage development interface web', '/Image/PhotoEntreprise/AxaAnonce.png', 'axa require compétence java, HTML, CSS, Python, JAvascript, Synfony, Angulard, Android, UNIX', 3, 113),
       (12, 'stage ', '/Image/PhotoEntreprise/AxaAnonce.png', 'axa satge java bac+145 si tu es pas mort', 56, 113);

INSERT INTO Conversation(idConversation, idUtilisateurA, idUtilisateurB, Libelle, idAnnonce)
VALUES (1, 1, 3, 'friends', null),
       (2, 3, 4, 'conseils', null),
       (3, 5, 11, 'Airbus stage java', 1),
       (111, 7, 18, 'stellantis stage test', 3),
       (10, 4, 113, 'axa stage dev jav web', 12);

INSERT INTO Message(idMessage, Message, DateEnvoi, idUtilisateur, idConversation)
VALUES (12343, 'Bonjour, je suis intéressé ...', '2022-01-24 10:21:20', 1, 1),
       (12345, 'Bonjour, votre candidature nous plait beaucoup, etes vous dispo dem pour un test ', '2022-01-24 11:43:20', 3, 1),
       (34343, 'Je suis disponible demain 1O heure pour passer le teste ', '2022-01-24 14:21:20', 1, 1),
       (3546432, 'Bonjour, vous avez réussi le test avec un grand success', '2022-01-27 10:05:20', 3, 1),
       (1, 'Bonjour, je suis intéressé par votre entreprise, et le poste que vous proposez .', '2022-01-24 9:21:20', 5, 3),
       (53432, 'Bonjour nom, le poste a déja été pris, bonne continuation pour vos recherche noublié pas de regarder nos offre sur le site : www.offre-de-merde.fr', '2022-01-25 9:21:20', 11, 3),
       (642432, 'Bonjour Francois, \n je suis très intéressé par votre offre blabla ', '2022-01-24 10:00:00', 7, 111),
       (6764564, 'Bonjour clement, le poste est toujours a pourvoir blabla', '2022-01-26 14:59:20', 18, 111),
       (7846543, 'Je peux faire l\'entretient cette semaine blbal ', '2022-01-30 16:21:58', 7, 111),
       (24632323, 'Oui pas de probleme, je peux vous proposez par Teams Vendredi 15 heure ? \n dans l\'attente de votre retour. blabla', '2022-01-24 14:21:20', 18, 111),
       (4, 'Bonjour, je suis intéressé par cette offre qui me correspond à 100% blzblz', '2022-01-24 15:21:20', 4, 10);


INSERT INTO Candidature(cvfile, lettremotivation, idannonce,  idcandidat)
VALUES ('/file/CVCandidat/fab.pdf', 'blabalbalblablal balbla ', 1, 2),
       ('/file/CVCandidat/fab.pdf', 'blabalbalblablal balbla ', 1, 3),
       ('/file/CVCandidat/fab.pdf', 'blabalbalblablal balbla ', 12, 2),
       ('/file/CVCandidat/fab.pdf', 'blabalbalblablal balbla ', 1, 4),
       ('/file/CVCandidat/fab.pdf', 'blabalbalblablal balbla ', 3, 7),
       ('/file/CVCandidat/fab.pdf', 'blabalbalblablal balbla ', 12, 4);


#------------------------------------------------------------
# Select *:
#------------------------------------------------------------

SELECT * FROM Utilisateur;
SELECT * FROM V_Candidat;
SELECT * FROM V_Entreprise;
SELECT * FROM Annonce;
SELECT * FROM Conversation;
SELECT * FROM Message;
SELECT * FROM Candidature;

SELECT * FROM Conversation WHERE idUtilisateurB = 4 and idUtilisateurA = 3;
SELECT * FROM Message WHERE idConversation = 1;




-- TODO : faire une vue pour récupérer les conversation du point de vue d'un utilisateurA
-- TODO : faire une vue pour le get du front avec plus informations pour simplifier éventuellement
