DROP TABLE IF EXISTS Postule;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Conversation_track;
DROP TABLE IF EXISTS Conversation;
DROP TABLE IF EXISTS Candidature;
DROP TABLE IF EXISTS Annonce;
DROP TABLE IF EXISTS Entreprise;
DROP TABLE IF EXISTS Experience;
DROP TABLE IF EXISTS Utilisateur;

#------------------------------------------------------------
# Table: Utilisateur
#------------------------------------------------------------

CREATE TABLE Utilisateur
(
    idUtilisateur  Int Auto_increment NOT NULL,
    Nom            Varchar(255)       NOT NULL,
    Prenom         Varchar(255),
    Email          Varchar(255)       NOT NULL,
    MotDePasse     Varchar(1000)      NOT NULL,
    token          VARCHAR(255),
    tokenTimeStamp VARCHAR(255),
    PhotoProfile   Varchar(255)       NOT NULL,
    Description    Varchar(1000),
    CVFile         Varchar(255),
    Type           VARCHAR(32)        NOT NULL,
    read_at        timestamp          NOT NULL DEFAULT '2000-01-01 00:00:00',
    CONSTRAINT Utilisateur_PK PRIMARY KEY (idUtilisateur)
) ENGINE = InnoDB;

#------------------------------------------------------------
# Table: Experience
#------------------------------------------------------------

CREATE TABLE Experience
(
    idExperience  INT Auto_increment NOT NULL,
    idUtilisateur INT                NOT NULL,
    dateDebut     timestamp          NOT NULL,
    dateFin       timestamp          NOT NULL DEFAULT '2000-01-01 00:00:00', -- la valeur par defaut est le 1er janvier 2000
    Societe       Varchar(255)       NOT NULL,
    Poste         Varchar(255)       NOT NULL,
    Type          Varchar(255)       NOT NULL,                               -- experiencePro / formation
    CONSTRAINT Experience_PK PRIMARY KEY (idExperience),
    CONSTRAINT Experience_FK FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur (idUtilisateur)
) ENGINE = InnoDB;


#------------------------------------------------------------
# Table: Annonce
#------------------------------------------------------------

CREATE TABLE Annonce
(
    idAnnonce       Int Auto_increment NOT NULL,
    titre           Varchar(255)       NOT NULL,
    Image           Varchar(255),
    Description     TEXT               NOT NULL,
    idEntreprise    Int                NOT NULL,
    datePublication timestamp          NOT NULL DEFAULT '2000-01-01 00:00:00'               NOT NULL,
    localisation    Varchar(255)       NOT NULL,
    lien            TEXT,
    CONSTRAINT Annonce_PK PRIMARY KEY (idAnnonce),
    CONSTRAINT Annonce_Entreprise_FK FOREIGN KEY (idEntreprise) REFERENCES Utilisateur (idUtilisateur)
) ENGINE = InnoDB;


#------------------------------------------------------------
# Table: Conversation
#------------------------------------------------------------

CREATE TABLE Conversation
(
    idConversation Int Auto_increment NOT NULL,
    idUtilisateurA Int                NOT NULL,
    idUtilisateurB Int                NOT NULL,
    Libelle        Varchar(32)        NOT NULL,
    idAnnonce      Int
    -- ,CONSTRAINT Conversation_AK PRIMARY KEY (idUtilisateurA,idUtilisateurB)
    ,
    CONSTRAINT Conversation_PK PRIMARY KEY (idConversation),
    CONSTRAINT ConvUserA_UserB_Unique UNIQUE (idUtilisateurA, idUtilisateurB)

    -- ,CONSTRAINT Conversation_Utilisateur_FK FOREIGN KEY (idCandidat) REFERENCES Utilisateur(idCandidat)
    ,
    CONSTRAINT Conversation_UtilisateurA_FK FOREIGN KEY (idUtilisateurA) REFERENCES Utilisateur (idUtilisateur),
    CONSTRAINT Conversation_UtilisateurB_FK FOREIGN KEY (idUtilisateurB) REFERENCES Utilisateur (idUtilisateur),
    CONSTRAINT Conversation_Annonce0_FK FOREIGN KEY (idAnnonce) REFERENCES Annonce (idAnnonce) ON DELETE SET NULL
) ENGINE = InnoDB;

#------------------------------------------------------------
# Table: Conversation_track
#------------------------------------------------------------

CREATE TABLE Conversation_track
(
    idConversationTrack Int Auto_increment NOT NULL,
    idUtilisateur       Int                NOT NULL,
    idConversation      Int                NOT NULL,
    read_at             timestamp          NOT NULL DEFAULT '2000-01-01 00:00:00',
    CONSTRAINT ConversationTrack_PK PRIMARY KEY (idConversationTrack),
    CONSTRAINT ConversationTrack_Utilisateur_FK FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur (idUtilisateur),
    CONSTRAINT ConversationTrack_Conversation_FK FOREIGN KEY (idConversation) REFERENCES Conversation (idConversation)
) ENGINE = InnoDB;

#------------------------------------------------------------
# Table: Message
#------------------------------------------------------------

CREATE TABLE Message
(
    idMessage      Int Auto_increment NOT NULL,
    Message        Varchar(1000)      NOT NULL,                                                              -- contenu du message
    DateEnvoi      timestamp          NOT NULL DEFAULT '2000-01-01 00:00:00',                                                              -- Date d'envoi du message
    idUtilisateur  Int                NOT NULL,                                                              -- utilisateur qui a envoyé le  -- vérifier que c'est userA ou userB avec trigger
    idConversation Int                NOT NULL,
    CONSTRAINT Message_PK PRIMARY KEY (idMessage),
    CONSTRAINT Message_Utilisateur_PK FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur (idUtilisateur),
    CONSTRAINT Message_Conversation_FK FOREIGN KEY (idConversation) REFERENCES Conversation (idConversation) -- probleme avec reference, il faut que ce soit usera ou userb mais pas les 2 ni user tout cours
) ENGINE = InnoDB;


#------------------------------------------------------------
# Table: Candidature
#------------------------------------------------------------

CREATE TABLE Candidature
(
    idCandidature    Int Auto_increment NOT NULL,
    CVfile           Varchar(255)       NOT NULL,
    LettreMotivation Varchar(2000),
    idCandidat       Int                NOT NULL,
    idAnnonce        Int                NOT NULL,
    retenue  	     tinyint(1)  NOT NULL DEFAULT -1,
    CONSTRAINT Candidature_PK PRIMARY KEY (idCandidature),
    CONSTRAINT Candidature_Candidat_FK FOREIGN KEY (idCandidat) REFERENCES Utilisateur (idUtilisateur),
    CONSTRAINT Candidature_Annonce0_FK FOREIGN KEY (idAnnonce) REFERENCES Annonce (idAnnonce) ON DELETE CASCADE
) ENGINE = InnoDB;



CREATE TABLE `userfav` (
   `idFav` int(11) NOT NULL,
   `idUser` int(11) NOT NULL,
   `idAnnonce` int(11) NOT NULL
);

ALTER TABLE `userfav`
    ADD PRIMARY KEY (`idFav`),
    ADD UNIQUE KEY `U_userFav` (`idUser`,`idAnnonce`),
    ADD KEY `FK_annonce` (`idAnnonce`);

ALTER TABLE `userfav`
    MODIFY `idFav` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `userfav`
    ADD CONSTRAINT `FK_annonce` FOREIGN KEY (`idAnnonce`) REFERENCES `annonce` (`idAnnonce`),
    ADD CONSTRAINT `FK_user` FOREIGN KEY (`idUser`) REFERENCES `utilisateur` (`idUtilisateur`);
COMMIT;


#------------------------------------------------------------
# Vues: Utilisateurs (candidat, entreprise)
#------------------------------------------------------------

CREATE OR REPLACE VIEW V_Candidat AS
SELECT Utilisateur.idUtilisateur,
       Utilisateur.Prenom,
       Utilisateur.Nom,
       Utilisateur.Email,
       Utilisateur.MotDePasse,
       Utilisateur.PhotoProfile,
       Utilisateur.Description,
       Utilisateur.CVFile,
       Utilisateur.Type
FROM Utilisateur
WHERE Type = 'Candidat';

CREATE OR REPLACE VIEW V_Entreprise AS
SELECT Utilisateur.idUtilisateur,
       Utilisateur.Nom,
       Utilisateur.Email,
       Utilisateur.MotDePasse,
       Utilisateur.PhotoProfile,
       Utilisateur.Type
FROM Utilisateur
WHERE Type = 'Entreprise';

CREATE OR REPLACE VIEW V_Conversation AS
SELECT ct.*, C.Libelle, C.idAnnonce, IF(ct.read_at > U.read_at, 1, 0) as stateMessage
FROM Conversation_track CT
         INNER JOIN Utilisateur U on CT.idUtilisateur = U.idUtilisateur
         INNER JOIN Conversation C on CT.idConversation = C.idConversation;

#------------------------------------------------------------
# Triggers:
#------------------------------------------------------------
DROP TRIGGER IF EXISTS T_Track_Message;

DELIMITER /
CREATE TRIGGER T_Track_Message
    BEFORE INSERT
    ON message
    FOR EACH ROW
BEGIN
    DECLARE userA, userB, idConv INT;

    SELECT idUtilisateurA INTO userA FROM conversation WHERE Conversation.idConversation = NEW.idConversation;
    SELECT idUtilisateurB INTO userB FROM conversation WHERE Conversation.idConversation = NEW.idConversation;
    SELECT COUNT(Conversation_track.idConversation)
    INTO idConv
    FROM conversation_track
    WHERE Conversation_track.idConversation = NEW.idConversation;

    IF idConv > 0 THEN
        UPDATE Conversation_track
        SET read_at = NOW()
        WHERE idConversation = NEW.idConversation
          AND idUtilisateur = userA;
        UPDATE Conversation_track
        SET read_at = NOW()
        WHERE idConversation = NEW.idConversation
          AND idUtilisateur = userB;
    ELSE
        INSERT INTO Conversation_track(idUtilisateur, idConversation, read_at)
        VALUES (userA, NEW.idConversation, NOW() - 1);
        INSERT INTO Conversation_track(idUtilisateur, idConversation, read_at)
        VALUES (userB, NEW.idConversation, NOW() - 1);
    END IF;

    UPDATE utilisateur SET read_at = NOW() WHERE idUtilisateur = NEW.idUtilisateur;
    UPDATE conversation_track
    SET read_at = NOW()
    WHERE idUtilisateur = NEW.idUtilisateur
      AND idConversation = NEW.idConversation;
END/

DELIMITER ;
#------------------------------------------------------------
# Inserts:
#------------------------------------------------------------

INSERT INTO Utilisateur(idUtilisateur, Prenom, Nom, Email, MotDePasse, PhotoProfile, Description, CVFile, Type, read_at)
VALUES (1, 'Thomas', 'Robert', 'thomas.robert@icoud.com', 'bucUJKdRehLFuAXB9JMXI1zafCHbxhZe3KLOoYXhdwQ=',
        'Thomas.jpg', 'Je suis actuellement à la recherche d une alternance pour Septembre 2022',
        'CV_ROBERT_Thomas_2022-alt.pdf', 'Candidat', '2022-01-01 09:58:44'),  -- thomas1234
       (2, 'Thomas', 'Robert', 'thomas.robert@gmail.com', 'Pquru7g/HSkAZH6KuIQv1dM9Lu/w1KKOOm3P5eq0vyU=',
        '1631351563860.jpeg', 'Je suis à la recherche d un stage pour Avril 2022', 'CV_ROBERT_Thomas_2022-alt.pdf', 'Candidat',
        '2022-01-01 09:58:44'),-- (thz83.ghzis;
       (3, 'Laurent', 'Ngeth', 'laurent.ngeth@icoud.com', 'lnUgriPo7hSIi65ygJAxuYOYrkpjZ3Phj/+RfXdnkzQ=',
        '1631351563860.jpeg', 'A la recherche d un stage en IA pour Septembre 2022',
        'CV_Dev_1.pdf', 'Candidat', '2022-01-01 09:58:44'), -- motdepasse
       (4, 'Florian', 'Le gal', 'flo.le.gal234@icoud.com', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=',
        '1634823518449.jpeg', 'Disponible pour un jobs dété en développement', 'pdf_modèle.pdf', 'Candidat',
        '2022-01-01 09:58:44'),                                             -- trtrterzrez
       (5, 'Ayoub', 'BEN FRAJ', 'ayoub23456@gmail.com', '1Byps/+Tsk2kOcMqsowk/QMiD77hPTxGUPIBJRcq5y0=',
        '1643362441723.jpeg', 'Actuellement en DUT informatique à lIUT de Paris Descartes', 'pdf_modèle.pdf', 'Candidat',
        '2022-01-01 09:58:44'),                                             -- root1234
       (6, 'Youcef', 'MEDILEH', 'Youcef.youcef93@icoud.c', 'NPK4qvAjzZZfWO6PM8WnvNLQnrR4fj6iFFDTC8Zp81c=',
        '1643362441723.jpeg', 'A la recherche dun stage en Cybersécurité ', 'pdf_modèle.pdf', 'Candidat',
        '2022-01-01 09:58:44'),                                             -- é/RTZJN(iuzdj4knfqd;.a@hea789er-ae
       (7, 'Fabien', 'Rondan', 'fabien.rondan@protonmail.com', 'uclQZA4bN0DpisuT5mnGV2b2Zw3RYJupH/QQUrpIxvM=',
        '1638893705524.jpeg', 'Actuellement en DUT Informatique à lIUT Paris Rives de Seine', 'pdf_modèle.pdf', 'Candidat',
        '2022-01-01 09:58:44'),                                             -- password1234
       (8, 'Fabien', 'Rondan', 'fabiendu56334@icoud.c', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=',
        '1638893705524.jpeg', 'A la recherche dun jobs dété', 'pdf_modèle.pdf', 'Candidat',
        '2022-01-01 09:58:44'),                                             -- trtrterzrez
       (10, 'Quentin', 'Robert', 'quentin.robert@gmail.com', 'O6HlR8B6shobWyVG/lsFpUAdmeYTOsx1A1M95KyQzi0=',
        'default.png', 'Médecin généraliste sur Paris', 'pdf_modèle.pdf',
        'Candidat', '2022-01-01 09:58:44'); -- quentinrobert

INSERT INTO Experience(idExperience, idUtilisateur, dateDebut, dateFin, Societe, Poste, Type)
VALUES (1, 1, '2020-01-01 09:58:44', '2021-01-01 09:58:44', 'Apple', 'Vendeur', 'experiencePro'),
       (2, 1, '2020-09-01 09:58:44', '2022-06-01 09:58:44', 'PARIS', 'IUT Informatique', 'formation'),
       (3, 1, '2022-04-04 09:58:44', '2022-06-10 09:58:44', 'Coworking', 'Développeur', 'experiencePro'),
       (4, 3, '2017-09-01 09:58:44', '2020-07-01 09:58:44', 'Paris', 'Etude Économie', 'formation'),
       (5, 3, '2020-09-01 09:58:44', '2022-06-01 09:58:44', 'Belfort-Paris', 'IUT informatique', 'formation');

INSERT INTO Experience(idExperience, idUtilisateur, dateDebut, Societe, Poste, Type)
VALUES (6, 3, '2022-04-04 00:00:00', 'Apple', 'Dev IA', 'experiencePro');


INSERT INTO Utilisateur(idUtilisateur, Nom, Email, MotDePasse, PhotoProfile, Type, read_at) -- mot de passe pour les entreprises : trtrterzrez
VALUES (11, 'Airbus group', 'recruteur@airbus.fr', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=',
        '1631370145894.jpeg', 'Entreprise',
        '2022-01-01 09:58:44'),
       (12, 'Alstom', 'recrutement@alstom.fr', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=',
        '1569914981715.jpeg', 'Entreprise',
        '2022-01-01 09:58:44'),
       (113, 'Axa', 'carrer@axa.fr', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=', '1589821547937.jpeg',
        'Entreprise',
        '2022-01-01 09:58:44'),
       (14, 'BNP Paribas', 'recrutement@bnp-paribas.fr', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=',
        '1640078572070.jpeg',
        'Entreprise', '2022-01-01 09:58:44'),
       (15, 'Bouygues', 'recrutement@bouyge.fr', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=',
        '1627559951146.jpeg', 'Entreprise',
        '2022-01-01 09:58:44'),
       (416, 'ENGIE', 'carrer@engie.fr', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=',
        '1579011791766.jpeg', 'Entreprise',
        '2022-01-01 09:58:44'),
       (17, 'Michelin', 'recruteur@michelin.fr', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=',
        '1519855925247.jpeg', 'Entreprise',
        '2022-01-01 09:58:44'),
       (18, 'Stellantis', 'recrutement@stellantis.fr', 'UO7328CJnIfAi+39/m+zk1pjirJKkfJ2VRdDJXSme/g=',
        '1608225605867.jpeg',
        'Entreprise', '2022-01-01 09:58:44');

INSERT INTO Annonce(idAnnonce, titre, Image, Description, idEntreprise, DatePublication, localisation, lien)
VALUES (1, 'stage developer java', null, 'airbus stage java bac+45', 11, '2022-03-24 14:21:20',
        'Paris','-1'),
       (3, 'stage test python', null, 'stellantis bac+34 minimum ecole d\'ingénieur du future', 18,
        '2022-03-24 14:21:20', 'Paris','-1'),
       (10, 'stage development interface web', '1589821547937.jpeg',
        'axa require compétence java, HTML, CSS, Python, JAvascript, Synfony, Angulard, Android, UNIX', 113,
        '2022-03-24 14:21:20', 'Paris','-1'),
       (12, 'stage ', '1589821547937.jpeg', 'axa satge java bac+145 si tu es pas mort', 113,
        '2022-03-24 14:21:20', 'Paris','-1');

INSERT INTO Conversation(idConversation, idUtilisateurA, idUtilisateurB, Libelle, idAnnonce)
VALUES (1, 1, 3, 'friends', null),
       (2, 3, 4, 'conseils', null),
       (3, 5, 11, 'Airbus stage java', 1),
       (111, 7, 18, 'stellantis stage test', 3),
       (10, 4, 113, 'axa stage dev jav web', 12);

-- update les read_at à maintenant
-- UPDATE Conversation SET read_at = NOW();
-- UPDATE Utilisateur SET read_at = NOW();

INSERT INTO Message(idMessage, Message, DateEnvoi, idUtilisateur, idConversation)
VALUES (12343, 'Bonjour, je suis intéressé ...', '2022-01-24 10:21:20', 1, 1),
       (12345, 'Bonjour, votre candidature nous plait beaucoup, êtes vous disponible demain pour un test ',
        '2022-01-24 11:43:20', 3, 1),
       (12346, 'message pour la conv 2 ', '2022-01-24 11:43:20', 3, 2),
       (34343, 'Je suis disponible demain 1O heure pour passer le teste ', '2022-01-24 14:21:20', 1, 1),
       (3546432, 'Bonjour, vous avez réussi le test avec un grand success', '2022-01-27 10:05:20', 3, 1),
       (1, 'Bonjour, je suis intéressé par votre entreprise, et le poste que vous proposez .', '2022-01-24 9:21:20', 5,
        3),
       (53432,
        'Bonjour nom, le poste a déja été pris, bonne continuation pour vos recherche noublié pas de regarder nos offre sur le site : www.offre-de-stage.fr',
        '2022-01-25 9:21:20', 11, 3),
       (642432, 'Bonjour Francois, \n je suis très intéressé par votre offre Bonne continuation', '2022-01-24 10:00:00', 7, 111),
       (6764564, 'Bonjour clement, le poste est toujours a pourvoir blabla', '2022-01-26 14:59:20', 18, 111),
       (7846543, 'Je peux faire l entretient cette semaine si ca va de votre coté ?', '2022-01-30 16:21:58', 7, 111),
       (24632323,
        'Oui pas de problème, je peux vous proposez par Teams Vendredi 15 heure ? \n dans l attente de votre retour. blabla',
        '2022-01-24 14:21:20', 18, 111),
       (4, 'Bonjour, je suis intéressé par cette offre qui me correspond à 100% au vu de mon parcourt ', '2022-01-24 15:21:20', 4, 10);


INSERT INTO Candidature(cvfile, lettremotivation, idannonce, idcandidat)
VALUES ('CV_ROBERT_Thomas_2022-alt.pdf', 'Objet : Candidature au poste de (emploi)
(Madame, Monsieur),
Etant actuellement à la recherche d’un emploi, je me permets de vous proposer ma candidature au poste de (emploi).
En effet, mon profil correspond à la description recherchée sur l’offre d’emploi (préciser où l’annonce a été vue). (Si le candidat possède peu d’expérience professionnelle) Ma formation en (préciser la formation) m''a permis d''acquérir de nombreuses compétences parmi celles que vous recherchez. Je possède tous les atouts qui me permettront de réussir dans le rôle que vous voudrez bien me confier. Motivation, rigueur et écoute sont les maîtres mots de mon comportement professionnel
(Si le candidat possède une expérience significative dans le poste à pourvoir). Mon expérience en tant que (emploi) m’a permis d’acquérir toutes les connaissances nécessaires à la bonne exécution des tâches du poste à pourvoir. Régulièrement confronté aux aléas du métier, je suis capable de répondre aux imprévus en toute autonomie.
Intégrer votre entreprise représente pour moi un réel enjeu d’avenir dans lequel mon travail et mon honnêteté pourront s’exprimer pleinement.
Restant à votre disposition pour toute information complémentaire, je suis disponible pour vous rencontrer lors d’un entretien à votre convenance
Veuillez agréer, (Madame, Monsieur), l’expression de mes sincères salutations.', 1, 2),
       ('CV_ROBERT_Thomas_2022-alt.pdf', 'Objet : Candidature au poste de (emploi)
(Madame, Monsieur),
Etant actuellement à la recherche d’un emploi, je me permets de vous proposer ma candidature au poste de (emploi).
En effet, mon profil correspond à la description recherchée sur l’offre d’emploi (préciser où l’annonce a été vue). (Si le candidat possède peu d’expérience professionnelle) Ma formation en (préciser la formation) m''a permis d''acquérir de nombreuses compétences parmi celles que vous recherchez. Je possède tous les atouts qui me permettront de réussir dans le rôle que vous voudrez bien me confier. Motivation, rigueur et écoute sont les maîtres mots de mon comportement professionnel
(Si le candidat possède une expérience significative dans le poste à pourvoir). Mon expérience en tant que (emploi) m’a permis d’acquérir toutes les connaissances nécessaires à la bonne exécution des tâches du poste à pourvoir. Régulièrement confronté aux aléas du métier, je suis capable de répondre aux imprévus en toute autonomie.
Intégrer votre entreprise représente pour moi un réel enjeu d’avenir dans lequel mon travail et mon honnêteté pourront s’exprimer pleinement.
Restant à votre disposition pour toute information complémentaire, je suis disponible pour vous rencontrer lors d’un entretien à votre convenance
Veuillez agréer, (Madame, Monsieur), l’expression de mes sincères salutations. ', 1, 3),
       ('CV_ROBERT_Thomas_2022-alt.pdf', 'Objet : Candidature au poste de (emploi)
(Madame, Monsieur),
Etant actuellement à la recherche d’un emploi, je me permets de vous proposer ma candidature au poste de (emploi).
En effet, mon profil correspond à la description recherchée sur l’offre d’emploi (préciser où l’annonce a été vue). (Si le candidat possède peu d’expérience professionnelle) Ma formation en (préciser la formation) m''a permis d''acquérir de nombreuses compétences parmi celles que vous recherchez. Je possède tous les atouts qui me permettront de réussir dans le rôle que vous voudrez bien me confier. Motivation, rigueur et écoute sont les maîtres mots de mon comportement professionnel
(Si le candidat possède une expérience significative dans le poste à pourvoir). Mon expérience en tant que (emploi) m’a permis d’acquérir toutes les connaissances nécessaires à la bonne exécution des tâches du poste à pourvoir. Régulièrement confronté aux aléas du métier, je suis capable de répondre aux imprévus en toute autonomie.
Intégrer votre entreprise représente pour moi un réel enjeu d’avenir dans lequel mon travail et mon honnêteté pourront s’exprimer pleinement.
Restant à votre disposition pour toute information complémentaire, je suis disponible pour vous rencontrer lors d’un entretien à votre convenance
Veuillez agréer, (Madame, Monsieur), l’expression de mes sincères salutations. ', 12, 2),
       ('CV_ROBERT_Thomas_2022-alt.pdf', 'Objet : Candidature au poste de (emploi)
(Madame, Monsieur),
Etant actuellement à la recherche d’un emploi, je me permets de vous proposer ma candidature au poste de (emploi).
En effet, mon profil correspond à la description recherchée sur l’offre d’emploi (préciser où l’annonce a été vue). (Si le candidat possède peu d’expérience professionnelle) Ma formation en (préciser la formation) m''a permis d''acquérir de nombreuses compétences parmi celles que vous recherchez. Je possède tous les atouts qui me permettront de réussir dans le rôle que vous voudrez bien me confier. Motivation, rigueur et écoute sont les maîtres mots de mon comportement professionnel
(Si le candidat possède une expérience significative dans le poste à pourvoir). Mon expérience en tant que (emploi) m’a permis d’acquérir toutes les connaissances nécessaires à la bonne exécution des tâches du poste à pourvoir. Régulièrement confronté aux aléas du métier, je suis capable de répondre aux imprévus en toute autonomie.
Intégrer votre entreprise représente pour moi un réel enjeu d’avenir dans lequel mon travail et mon honnêteté pourront s’exprimer pleinement.
Restant à votre disposition pour toute information complémentaire, je suis disponible pour vous rencontrer lors d’un entretien à votre convenance
Veuillez agréer, (Madame, Monsieur), l’expression de mes sincères salutations. ', 1, 4),
       ('CV_ROBERT_Thomas_2022-alt.pdf', 'Objet : Candidature au poste de (emploi)
(Madame, Monsieur),
Etant actuellement à la recherche d’un emploi, je me permets de vous proposer ma candidature au poste de (emploi).
En effet, mon profil correspond à la description recherchée sur l’offre d’emploi (préciser où l’annonce a été vue). (Si le candidat possède peu d’expérience professionnelle) Ma formation en (préciser la formation) m''a permis d''acquérir de nombreuses compétences parmi celles que vous recherchez. Je possède tous les atouts qui me permettront de réussir dans le rôle que vous voudrez bien me confier. Motivation, rigueur et écoute sont les maîtres mots de mon comportement professionnel
(Si le candidat possède une expérience significative dans le poste à pourvoir). Mon expérience en tant que (emploi) m’a permis d’acquérir toutes les connaissances nécessaires à la bonne exécution des tâches du poste à pourvoir. Régulièrement confronté aux aléas du métier, je suis capable de répondre aux imprévus en toute autonomie.
Intégrer votre entreprise représente pour moi un réel enjeu d’avenir dans lequel mon travail et mon honnêteté pourront s’exprimer pleinement.
Restant à votre disposition pour toute information complémentaire, je suis disponible pour vous rencontrer lors d’un entretien à votre convenance
Veuillez agréer, (Madame, Monsieur), l’expression de mes sincères salutations. ', 3, 7),
       ('CV_ROBERT_Thomas_2022-alt.pdf', 'Objet : Candidature au poste de (emploi)
(Madame, Monsieur),
Etant actuellement à la recherche d’un emploi, je me permets de vous proposer ma candidature au poste de (emploi).
En effet, mon profil correspond à la description recherchée sur l’offre d’emploi (préciser où l’annonce a été vue). (Si le candidat possède peu d’expérience professionnelle) Ma formation en (préciser la formation) m''a permis d''acquérir de nombreuses compétences parmi celles que vous recherchez. Je possède tous les atouts qui me permettront de réussir dans le rôle que vous voudrez bien me confier. Motivation, rigueur et écoute sont les maîtres mots de mon comportement professionnel
(Si le candidat possède une expérience significative dans le poste à pourvoir). Mon expérience en tant que (emploi) m’a permis d’acquérir toutes les connaissances nécessaires à la bonne exécution des tâches du poste à pourvoir. Régulièrement confronté aux aléas du métier, je suis capable de répondre aux imprévus en toute autonomie.
Intégrer votre entreprise représente pour moi un réel enjeu d’avenir dans lequel mon travail et mon honnêteté pourront s’exprimer pleinement.
Restant à votre disposition pour toute information complémentaire, je suis disponible pour vous rencontrer lors d’un entretien à votre convenance
Veuillez agréer, (Madame, Monsieur), l’expression de mes sincères salutations. ', 12, 4);


INSERT INTO `userfav` (`idFav`, `idUser`, `idAnnonce`) VALUES
   (2, 3, 1),
   (1, 3, 3);

#------------------------------------------------------------
# Select *:
#------------------------------------------------------------

#SELECT * FROM Utilisateur;
#SELECT * FROM V_Candidat;
#SELECT * FROM V_Entreprise;
#SELECT * FROM Annonce;
SELECT * FROM Conversation;
SELECT * FROM Message;
#SELECT * FROM Candidature;

#SELECT * FROM Conversation WHERE idUtilisateurB = 4 and idUtilisateurA = 3;
#SELECT * FROM Message WHERE idConversation = 1;


#------------------------------------------------------------ TEST
#SELECT A.idAnnonce, A.titre, A.image, A.Description, A.idEntreprise, COUNT(C.idCandidature) AS NbCandidat FROM Annonce A
#LEFT JOIN Candidature C ON A.idAnnonce = C.idannonce
#GROUP BY A.idAnnonce;


#SELECT A.idAnnonce, A.titre, A.image, A.Description, A.idEntreprise, COUNT(C.idCandidature) AS NbCandidat FROM Annonce A LEFT JOIN Candidature C ON A.idAnnonce = C.idannonce WHERE A.idAnnonce = 10 GROUP BY A.idAnnonce;

#UPDATE experience SET dateDebut = '1234567', dateFin = '1', Societe = 'paris', Poste = 'touriste' WHERE idExperience = 1;
