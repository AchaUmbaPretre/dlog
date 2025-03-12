-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 12 mars 2025 à 16:51
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `dlog`
--

-- --------------------------------------------------------

--
-- Structure de la table `activite`
--

CREATE TABLE `activite` (
  `id_activite` int(11) NOT NULL,
  `nom_activite` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `activite`
--

INSERT INTO `activite` (`id_activite`, `nom_activite`) VALUES
(1, 'Électricité'),
(2, 'Électronique'),
(3, 'Plomberie'),
(4, 'BTP');

-- --------------------------------------------------------

--
-- Structure de la table `activite_fournisseur`
--

CREATE TABLE `activite_fournisseur` (
  `id_activite_fournisseur` int(11) NOT NULL,
  `id_fournisseur` int(11) DEFAULT NULL,
  `id_activite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `activite_fournisseur`
--

INSERT INTO `activite_fournisseur` (`id_activite_fournisseur`, `id_fournisseur`, `id_activite`) VALUES
(1, 1, 3),
(2, 2, 3);

-- --------------------------------------------------------

--
-- Structure de la table `adresse`
--

CREATE TABLE `adresse` (
  `id_adresse` int(11) NOT NULL,
  `adresse` varchar(200) NOT NULL,
  `id_bin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `adresse`
--

INSERT INTO `adresse` (`id_adresse`, `adresse`, `id_bin`) VALUES
(1, 'C/Ngaliema, Q/Lalu N°40', 10),
(2, 'seeee', 5),
(3, 'Fffffffff', 6),
(4, 'rrrrrrrrrrrrrrrrr', 5),
(5, 'ddddddddddddddddd', 5),
(6, 'aaaaaaaaaaaaaaaaaaaaaaaa', 6),
(7, 'DFFFCCCCCCCCCCCC', 11);

-- --------------------------------------------------------

--
-- Structure de la table `articles`
--

CREATE TABLE `articles` (
  `id_article` int(11) NOT NULL,
  `nom_article` varchar(255) NOT NULL,
  `prix_unitaire` decimal(10,2) DEFAULT NULL,
  `id_categorie` int(11) DEFAULT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `articles`
--

INSERT INTO `articles` (`id_article`, `nom_article`, `prix_unitaire`, `id_categorie`, `est_supprime`) VALUES
(1, '', NULL, 0, 1),
(2, 'Chauffe-eau électrique', NULL, 1, 0),
(3, '', NULL, 0, 0),
(4, 'Colle industrielle', NULL, 1, 0),
(5, 'Coffret de premiers secours', NULL, 4, 0),
(6, 'Balais industriels', NULL, 4, 0),
(7, 'Gilets haute visibilité', NULL, 5, 0),
(8, 'Revêtement ignifuge', NULL, 4, 0),
(9, 'Mastic de réparation', NULL, 3, 0),
(10, 'Nettoyant pour surface', NULL, 4, 0),
(11, 'Bandes adhésives de protection', NULL, 6, 0),
(12, 'Échelle de sécurité', NULL, 7, 0),
(13, 'Panneaux MDF', NULL, 8, 0),
(14, 'Accessoires de peinture', NULL, 3, 0),
(15, 'Câbles de levage', NULL, 7, 0),
(16, 'Prises murales', NULL, 1, 0),
(17, 'Piles pour appareils', NULL, 8, 0),
(18, 'Pompe à eau', NULL, 9, 0),
(19, 'Connecteurs de câble', NULL, 1, 0),
(20, 'Peinture isolante', NULL, 6, 0),
(21, 'Ciment Portland', NULL, 7, 0),
(22, 'Goupilles de sécurité', NULL, 10, 0),
(23, 'Colle à bois', NULL, 3, 0),
(24, 'Joint de dilatation', NULL, 10, 0),
(25, 'Rallonge électrique', NULL, 7, 0),
(26, 'Seau de peinture', NULL, 1, 0),
(27, 'Transformateur', NULL, 4, 0),
(28, 'Gravier', NULL, 10, 0),
(29, 'Tubes fluorescents', NULL, 1, 0),
(30, 'Matériel d’étanchéité', NULL, 1, 0),
(31, 'Papier peint', NULL, 9, 0),
(32, 'Porte-fusible', NULL, 9, 0),
(33, 'Raccords en cuivre', NULL, 2, 0),
(34, 'Briques creuses', NULL, 8, 0),
(35, 'Cadenas de sécurité', NULL, 4, 0),
(36, 'Rubans de signalisation', NULL, 1, 0),
(37, 'Filtre à air', NULL, 7, 0),
(38, 'Boîte de dérivation', NULL, 3, 0),
(40, 'Brassard réfléchissant', NULL, 8, 0),
(41, 'Chariot élévateur', NULL, 9, 0),
(42, 'Casques de sécurité', NULL, 10, 0),
(43, 'Peinture de sol', NULL, 6, 0),
(44, 'Peinture murale', NULL, 11, 0),
(47, 'Barres d\'armature', NULL, 2, 0),
(49, 'Perceuse à colonne', NULL, 1, 0),
(50, 'Rouleaux à peinture', NULL, 6, 0),
(51, 'Harnais de sécurité', NULL, 1, 0),
(52, 'Brosses à peinture', NULL, 1, 0),
(53, 'Treuil manuel', NULL, 3, 0),
(54, 'Détecteurs de fumée', NULL, 3, 0),
(55, 'Sac de sable', NULL, 7, 0),
(57, 'Composés anti-rouille', NULL, 11, 0),
(58, 'Polisseuse', NULL, 5, 0),
(59, 'Vérin hydraulique', NULL, 2, 0),
(61, 'Séparateurs de voie', NULL, 7, 0),
(62, 'Câble électrique', NULL, 3, 0),
(64, 'Lubrifiant industriel', NULL, 6, 0),
(65, 'Palette ordinaire', NULL, 3, 0),
(70, 'Gants anti-chaleur', NULL, 4, 0),
(71, 'Transpalette', NULL, 5, 0),
(72, 'Veste de sécurité', NULL, 11, 0),
(73, 'Forets de précision', NULL, 8, 0),
(75, 'Équipement d\'éclairage', NULL, 4, 0),
(76, 'Matériel de soudure', NULL, 2, 0),
(77, 'Peinture à l\'huile', NULL, 5, 0),
(78, 'Cloueur pneumatique', NULL, 11, 0),
(79, 'Inverter', NULL, 6, 0),
(80, 'Pinceau à vernis', NULL, 11, 0),
(82, 'Générateur électrique', NULL, 8, 0),
(83, 'Primaire d\'accrochage', NULL, 10, 0),
(85, 'Filets antichute', NULL, 7, 0),
(86, 'Solvants de peinture', NULL, 4, 0),
(88, 'Perche télescopique', NULL, 9, 0),
(89, 'Panneaux de signalisation', NULL, 10, 0),
(90, 'Chariot de transport', NULL, 4, 0),
(91, 'Pompe à incendie', NULL, 7, 0),
(94, 'Grille de ventilation', NULL, 5, 0),
(96, 'Accessoires de treuil', NULL, 7, 0),
(97, 'Visières de protection', NULL, 6, 0),
(99, 'Gants en cuir', NULL, 8, 0),
(100, 'Scie à métaux', NULL, 10, 0),
(101, 'Chaussures de sécurité', NULL, 4, 0),
(102, 'Peinture époxy', NULL, 4, 0),
(104, 'Matériel de nettoyage', NULL, 2, 0),
(105, 'Gants en nitrile', NULL, 9, 0),
(106, 'Chiffons industriels', NULL, 8, 0),
(107, 'Bouteilles de gaz', NULL, 10, 0),
(108, 'Interrupteur', NULL, 10, 0),
(109, 'Sangles de manutention', NULL, 3, 0),
(110, 'Équipement de protection contre les chutes', NULL, 8, 0),
(111, 'Panneaux solaires', NULL, 9, 0),
(113, 'Palans à chaîne', NULL, 4, 0),
(115, 'Boulons et écrous', NULL, 4, 0),
(116, 'Papier de verre', NULL, 10, 0),
(121, 'Multimètre', NULL, 9, 0),
(122, 'Projecteurs LED', NULL, 5, 0),
(128, 'Plaques de fixation murale', NULL, 4, 0),
(134, 'Palette en plastique', NULL, 2, 0),
(136, 'Tuyaux PVC', NULL, 2, 0),
(139, 'Pinceaux', NULL, 7, 0),
(140, 'Extincteurs', NULL, 1, 0),
(150, 'Palette double en bois dur', NULL, 9, 0),
(152, 'Pneus pour chariot élévateur', NULL, 9, 0),
(155, 'Robinet mitigeur', NULL, 10, 0),
(159, 'Pompe hydraulique', NULL, 2, 0),
(160, 'Camion benne', NULL, 7, 0),
(162, 'Scie circulaire', NULL, 8, 0),
(163, 'Perceuse électrique', NULL, 4, 0),
(172, 'Clés à molette', NULL, 5, 0),
(187, 'Batterie de secours', NULL, 9, 0),
(191, 'Peinture anti-corrosion', NULL, 10, 0),
(193, 'Matériaux d\'isolation', NULL, 7, 0),
(194, 'Étiquettes de marquage', NULL, 7, 0),
(195, 'Vis à bois', NULL, 7, 0),
(197, 'Caméras de surveillance', NULL, 11, 0),
(200, 'Coffret à outils', NULL, 9, 0),
(202, 'Filet de sécurité', NULL, 10, 0),
(204, 'Gants de manutention', NULL, 2, 0),
(205, 'Détecteur de tension', NULL, 10, 0),
(206, 'Luminaires LED', NULL, 8, 0),
(207, 'Ruban de masquage', NULL, 9, 0),
(211, 'Pistolet à peinture', NULL, 6, 0),
(215, 'Kit de réparation de fuites', NULL, 10, 0),
(221, 'Marquage au sol', NULL, 1, 0),
(223, 'Soudeuse électrique', NULL, 9, 0),
(224, 'Rubans adhésifs', NULL, 3, 0),
(226, 'Dévidoirs de câble', NULL, 4, 0),
(236, 'Pompe à graisse', NULL, 9, 0),
(238, 'Chalumeau', NULL, 11, 0),
(242, 'Rallonge multiprise', NULL, 4, 0),
(250, 'Kit de joints mécaniques', NULL, 9, 0),
(251, 'Poutres en acier', NULL, 9, 0),
(255, 'Filet d\'arrimage', NULL, 11, 0),
(268, 'Étagères de rangement', NULL, 3, 0),
(284, 'Cône de signalisation', NULL, 11, 0),
(289, 'Vérins de levage', NULL, 11, 0),
(298, 'Casque anti-bruit', NULL, 11, 0),
(301, 'Palette en bois dur', NULL, 2, 0),
(302, 'Adhésifs de protection', NULL, 4, 0),
(303, 'Échelle télescopique', NULL, 6, 0),
(308, 'Signalisation de sécurité', NULL, 9, 0),
(311, 'Peinture vinyle', NULL, 2, 0),
(314, 'Balises de sécurité', NULL, 4, 0),
(333, 'Peinture au latex', NULL, 7, 0),
(353, 'Seringues de peinture', NULL, 7, 0),
(360, 'Pneus pour véhicule utilitaire', NULL, 3, 0),
(397, 'Poteaux de sécurité', NULL, 2, 0),
(404, 'Barrières de sécurité', NULL, 4, 0),
(406, 'Disjoncteur', NULL, 5, 0),
(415, 'Aspirateur industriel', NULL, 7, 0),
(430, 'Revêtement de sol antidérapant', NULL, 9, 0),
(439, 'Clé dynamométrique', NULL, 7, 0),
(445, 'Câbles de sécurité', NULL, 9, 0),
(453, 'Masque respiratoire', NULL, 1, 0),
(466, 'Gants anti-coupure', NULL, 9, 0),
(496, 'Sacs poubelle', NULL, 10, 0),
(503, 'Bac de rétention', NULL, 5, 0),
(529, 'Ampoules LED', NULL, 8, 0),
(545, 'Mastic de plomberie', NULL, 4, 0),
(590, 'Planches de bois', NULL, 4, 0),
(765, 'Chargeurs de batterie', NULL, 11, 0),
(878, 'Marteau perforateur', NULL, 5, 0),
(10001, 'LitTTT', NULL, 1, 0),
(10002, 'Chaise TX', NULL, 2, 0),
(10003, 'Ventilateur XR', NULL, 2, 0);

-- --------------------------------------------------------

--
-- Structure de la table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id_audit_logs` int(11) NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `id_tache` int(11) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `audit_logs`
--

INSERT INTO `audit_logs` (`id_audit_logs`, `action`, `user_id`, `id_tache`, `timestamp`) VALUES
(1, 'Modification', 3, 31, '2024-11-26 12:36:18'),
(2, 'Création', 12, 32, '2024-11-26 13:34:54'),
(3, 'Modification', 3, 32, '2024-11-26 13:35:36'),
(4, 'Modification', 3, 32, '2024-11-26 13:42:43'),
(5, 'Création', 12, 33, '2024-11-26 13:43:53'),
(6, 'Suppression', 3, 33, '2024-11-26 14:51:46'),
(7, 'Création', 3, 35, '2024-11-27 11:04:40'),
(8, 'Création', 3, 36, '2024-11-27 11:14:32'),
(9, 'Création', 3, 37, '2024-11-27 11:16:48'),
(10, 'Création', 3, 38, '2024-11-27 11:52:49'),
(11, 'Création', 3, 39, '2024-11-27 12:42:37'),
(12, 'Création', 3, 40, '2024-11-27 12:56:49'),
(13, 'Création', 3, 41, '2024-11-27 12:59:15'),
(14, 'Création', 3, 42, '2024-11-27 13:33:25'),
(15, 'Création', 3, 43, '2024-11-27 13:47:33'),
(16, 'Création', 12, 44, '2024-11-27 14:01:30'),
(17, 'Création', 3, 45, '2024-11-27 14:43:29'),
(18, 'Création', 12, 46, '2024-11-27 14:51:46'),
(19, 'Création', 12, 47, '2024-11-27 14:59:14'),
(20, 'Création', 12, 48, '2024-11-27 15:03:36'),
(21, 'Création', 12, 49, '2024-11-27 15:06:12'),
(22, 'Création', 12, 50, '2024-11-27 15:09:47'),
(23, 'Création', 12, 51, '2024-11-27 16:27:34'),
(24, 'Création', 12, 52, '2024-11-27 16:33:37'),
(25, 'Création', 12, 53, '2024-11-27 16:35:40'),
(26, 'Création', 3, 54, '2024-11-27 16:37:33'),
(27, 'Création', 3, 55, '2024-11-27 16:39:24'),
(28, 'Création', 3, 56, '2024-11-27 16:41:04'),
(29, 'Création', 3, 57, '2024-11-27 16:43:08'),
(30, 'Création', 3, 58, '2024-11-28 12:30:14'),
(31, 'Création', 12, 59, '2024-11-28 12:31:33'),
(32, 'Création', 12, 60, '2024-11-28 12:40:25'),
(33, 'Création', 3, 61, '2024-11-28 12:47:25'),
(34, 'Création', 12, 62, '2024-11-28 12:48:14'),
(35, 'Création', 12, 63, '2024-11-28 13:01:41'),
(36, 'Création', 3, 64, '2024-11-28 15:17:15'),
(37, 'Création', 3, 65, '2024-11-28 15:18:23'),
(38, 'Création', 3, 66, '2024-11-28 15:19:34'),
(39, 'Création', 12, 67, '2024-11-28 15:28:44'),
(40, 'Création', 3, 68, '2024-12-12 16:08:00'),
(41, 'Création', 3, 69, '2024-12-12 16:14:50'),
(42, 'Création', 3, 70, '2024-12-12 16:25:31'),
(43, 'Création', 3, 71, '2024-12-12 16:27:03');

-- --------------------------------------------------------

--
-- Structure de la table `batiment`
--

CREATE TABLE `batiment` (
  `id_batiment` int(11) NOT NULL,
  `nom_batiment` varchar(255) NOT NULL,
  `site` varchar(200) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `longueur` decimal(10,0) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `largeur` decimal(10,0) DEFAULT NULL,
  `hauteur` decimal(10,0) DEFAULT NULL,
  `surface_sol` decimal(10,0) DEFAULT NULL,
  `surface_murs` decimal(10,0) DEFAULT NULL,
  `metres_lineaires` decimal(10,0) DEFAULT NULL,
  `type_batiment` enum('bureaux','entrepot') DEFAULT NULL,
  `statut_batiment` int(11) DEFAULT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `batiment`
--

INSERT INTO `batiment` (`id_batiment`, `nom_batiment`, `site`, `ville`, `longueur`, `date_creation`, `date_modification`, `largeur`, `hauteur`, `surface_sol`, `surface_murs`, `metres_lineaires`, `type_batiment`, `statut_batiment`, `est_supprime`) VALUES
(1, 'Batiment 22', NULL, '1', NULL, '2024-09-07 12:52:22', '2025-01-22 10:24:49', NULL, NULL, NULL, NULL, NULL, 'bureaux', 2, 0),
(2, 'Batiment 2', 'Maluku', '2', NULL, '2024-09-24 11:46:53', '2024-10-10 13:03:55', NULL, NULL, NULL, NULL, NULL, 'entrepot', NULL, 1),
(3, 'Batiment 3', 'Ngaliema', '1', NULL, '2024-09-24 11:49:55', '2025-01-22 10:25:52', NULL, NULL, NULL, NULL, NULL, 'entrepot', 1, 0),
(4, 'Batiment 4', 'Gombe', '7', 1000, '2024-09-26 08:44:09', '2025-01-22 10:33:06', 200, NULL, 10, 8, 150, NULL, 1, 0),
(5, 'Batiment 2', 'Maluku', '5', NULL, '2024-09-30 16:05:20', '2025-01-22 12:42:35', NULL, NULL, NULL, NULL, NULL, NULL, 2, 0),
(6, 'Batiment 2', 'Maluku', '2', NULL, '2024-09-30 16:08:25', '2024-09-30 16:08:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
(7, 'Batiment 6', 'Maluku', '6', 2000, '2024-09-30 16:15:52', '2024-10-01 10:01:36', 1000, 500, NULL, NULL, NULL, NULL, NULL, 0),
(8, 'Batiment 20', 'Maluku', '1', 2000, '2024-10-01 09:54:56', '2024-10-01 09:54:56', 1000, 800, NULL, NULL, NULL, NULL, NULL, 0),
(9, 'Batiment 5', 'Maluku', '1', 2000, '2024-10-01 10:00:47', '2024-10-01 10:00:47', 1000, 800, NULL, NULL, NULL, NULL, NULL, 0),
(10, 'Batiment 8', 'Maluku', '6', 2000, '2024-10-01 10:01:36', '2024-10-01 10:02:34', 1000, 500, NULL, NULL, NULL, NULL, NULL, 0),
(12, 'Batiment 101', 'Maluku', '6', 2000, '2024-10-01 10:02:47', '2024-10-01 10:15:32', 1000, 500, NULL, NULL, NULL, NULL, NULL, 0),
(13, 'Batiment 102', 'Maluku', '6', 2000, '2024-10-01 10:07:34', '2024-10-01 10:17:15', 1000, 500, NULL, NULL, NULL, NULL, NULL, 0),
(14, 'Batiment 99', 'Maluku', '1', 1000, '2024-10-01 12:14:20', '2024-10-01 12:14:20', 800, 400, 100, 200, 1200, 'bureaux', NULL, 0),
(15, 'Batiment 98', 'Limete', '1', 2000, '2024-10-01 12:15:47', '2024-10-01 12:15:47', 800, 500, 300, 200, 500, 'entrepot', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `batiment_plans`
--

CREATE TABLE `batiment_plans` (
  `id_batiment_plans` int(11) NOT NULL,
  `id_batiment` int(11) NOT NULL,
  `nom_document` varchar(255) NOT NULL,
  `type_document` varchar(50) NOT NULL,
  `chemin_document` varchar(255) NOT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `batiment_plans`
--

INSERT INTO `batiment_plans` (`id_batiment_plans`, `id_batiment`, `nom_document`, `type_document`, `chemin_document`, `date_ajout`) VALUES
(1, 1, 'image', 'Image', 'public/uploads/92f9500d-bbe7-403c-be81-d5c1b1ba5893.jpg', '2024-09-20 13:33:20'),
(2, 1, 'image', 'Image', 'public/uploads/40a071a2-2fba-4a45-b7f7-56801e418b66.jpg', '2024-09-20 13:33:20'),
(3, 1, 'image', 'Image', 'public/uploads/921f759b-0f97-4748-8fa4-70aa61346a5d.png', '2024-09-20 14:48:32'),
(4, 1, 'image', 'Image', 'public/uploads/ef3f5515-7e39-43d7-8b73-91b69269e11b.png', '2024-09-20 14:48:32'),
(5, 1, 'image', 'Image', 'public/uploads/2f134151-944d-4810-984e-1e6fafd8bcc3.jpg', '2024-09-20 14:48:32'),
(6, 1, 'image', 'Image', 'public/uploads/fdd46db3-b333-4c0a-89f1-fb494a53f437.jpg', '2024-09-20 14:48:32'),
(7, 1, 'image', 'Image', 'public/uploads/e641136e-84db-4b88-8b45-5a6fbf40b502.png', '2024-09-20 14:48:32'),
(8, 1, 'image', 'Image', 'public/uploads/be98c00a-aa60-4a27-84ad-439af7c9aa3d.png', '2024-09-20 14:48:32'),
(9, 1, 'image', 'Image', 'public/uploads/b6ac4eec-8f87-4871-b326-bbddd72e5ee8.png', '2024-09-20 14:48:32'),
(10, 1, 'image', 'Image', 'public/uploads/c488031a-2186-4ccb-9759-9dcedae04d25.png', '2024-09-20 14:48:32'),
(11, 1, 'word', 'Word', 'public/uploads/df5acbf3-3ec1-423f-80ae-f93fd1ec4a68.doc', '2024-09-24 10:06:50'),
(12, 5, 'Img', 'Image', 'public/uploads/60edbce7-8a41-4ead-8e8d-24a86bd0049c.png', '2024-11-15 11:32:46');

-- --------------------------------------------------------

--
-- Structure de la table `besoins`
--

CREATE TABLE `besoins` (
  `id_besoin` int(11) NOT NULL,
  `id_article` int(11) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `quantite` int(11) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `priorite` enum('Haute','Moyenne','Faible') NOT NULL DEFAULT 'Moyenne',
  `id_projet` int(11) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `personne` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `besoins`
--

INSERT INTO `besoins` (`id_besoin`, `id_article`, `description`, `quantite`, `date_creation`, `priorite`, `id_projet`, `id_client`, `id_batiment`, `personne`) VALUES
(13, 1, 'vvvvvv', 1, '2024-09-26 13:16:13', 'Moyenne', 16, NULL, NULL, NULL),
(14, 4, 'DDDDDDDDDDD', 1, '2024-09-26 14:58:38', 'Moyenne', 16, 2, 1, 6),
(15, 26, 'SSSSSSSSSSSS', 1, '2024-09-26 15:05:59', 'Moyenne', 16, 3, 1, 3),
(16, 4, 'sssssssssssssssssssssss', 1, '2024-10-15 09:34:31', 'Moyenne', 26, NULL, 8, NULL),
(17, 19, NULL, 1, '2024-10-15 09:35:59', 'Moyenne', 26, NULL, NULL, NULL),
(19, 26, 'peinture', 1, '2024-10-16 09:20:37', 'Moyenne', 26, NULL, 8, NULL),
(20, 4, 'colle', 1, '2024-10-16 10:17:33', 'Moyenne', 26, NULL, NULL, NULL),
(21, 36, NULL, 1, '2024-10-16 12:11:16', 'Moyenne', 26, NULL, NULL, NULL),
(22, 4, 'DDDDDDDDDDD', 1, '2024-10-16 13:42:47', 'Moyenne', 27, 2, NULL, NULL),
(23, 36, NULL, 1, '2024-10-16 13:46:26', 'Moyenne', 27, 4, NULL, NULL),
(24, 29, 'QQQQQQQQQQCCCCXEEE', 1, '2024-10-16 13:47:26', 'Moyenne', 27, 2, NULL, NULL),
(25, 30, 'Etancheité', 1, '2024-10-16 13:50:45', 'Moyenne', 27, 7, NULL, NULL),
(26, 4, NULL, 1, '2024-10-21 13:28:56', 'Moyenne', 16, 1, 3, 6),
(27, 136, NULL, 1, '2024-10-21 14:20:13', 'Moyenne', 16, 1, 1, 7);

-- --------------------------------------------------------

--
-- Structure de la table `besoin_client`
--

CREATE TABLE `besoin_client` (
  `id_besoin_client` int(11) NOT NULL,
  `id_besoin` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `ville` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `besoin_client`
--

INSERT INTO `besoin_client` (`id_besoin_client`, `id_besoin`, `id_client`, `quantite`, `id_batiment`, `ville`) VALUES
(2, 13, 1, 1, 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `besoin_offre`
--

CREATE TABLE `besoin_offre` (
  `id_besoin_offre` int(11) NOT NULL,
  `id_besoin` int(11) DEFAULT NULL,
  `id_offre` int(11) DEFAULT NULL,
  `prix` decimal(10,2) DEFAULT 0.00,
  `quantite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `besoin_offre`
--

INSERT INTO `besoin_offre` (`id_besoin_offre`, `id_besoin`, `id_offre`, `prix`, `quantite`) VALUES
(1, NULL, 1, 100.00, 2),
(2, NULL, 2, 90.00, 2),
(3, NULL, 3, 100.00, 2),
(4, NULL, 4, 50.00, 2),
(5, NULL, 5, 50.00, 5),
(6, NULL, 6, 30.00, 1),
(7, NULL, 6, 30.00, 2),
(8, NULL, 7, 10.00, 2),
(9, NULL, 7, 10.00, 10),
(10, NULL, 8, 8.00, 2),
(11, NULL, 8, 9.00, 5);

-- --------------------------------------------------------

--
-- Structure de la table `bins`
--

CREATE TABLE `bins` (
  `id` int(11) NOT NULL,
  `id_batiment` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `superficie` decimal(10,2) DEFAULT NULL,
  `longueur` decimal(10,2) DEFAULT NULL,
  `largeur` decimal(10,2) DEFAULT NULL,
  `hauteur` decimal(10,2) DEFAULT NULL,
  `capacite` decimal(10,2) DEFAULT NULL,
  `type_stockage` int(11) DEFAULT NULL,
  `statut` int(11) DEFAULT NULL,
  `id_adresse` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bins`
--

INSERT INTO `bins` (`id`, `id_batiment`, `nom`, `superficie`, `longueur`, `largeur`, `hauteur`, `capacite`, `type_stockage`, `statut`, `id_adresse`, `date_creation`, `date_modification`, `est_supprime`) VALUES
(5, 3, 'Bin12', 1000.00, 1000.00, 5000.00, 200.00, 200.00, 1, 1, 0, '2024-10-03 14:27:07', '2024-10-10 12:32:56', 0),
(6, 2, 'BIN4', 2000.00, 1000.00, 500.00, 200.00, 500.00, 1, 1, 0, '2024-10-03 14:29:24', '2024-10-10 12:32:56', 0),
(7, 3, 'Bin5', 2000.00, 1000.00, 100.00, 200.00, 200.00, 1, 1, 0, '2024-10-03 14:31:02', '2024-10-10 12:32:56', 0),
(8, 2, 'BIN1', 1000.00, 8000.00, 500.00, 200.00, 50.00, 1, 1, 0, '2024-10-03 15:46:17', '2024-10-10 12:39:28', 1),
(9, 3, 'Bin 1', 200.00, 1100.00, 120.00, 100.00, 1000.00, 1, 1, 0, '2024-11-12 12:07:17', '2024-11-12 12:07:17', 0),
(10, 3, 'Bin111', 100.00, 50.00, 25.00, 50.00, 100.00, 1, 1, NULL, '2024-11-12 13:00:32', '2024-11-12 13:00:32', 0),
(11, 3, 'BIN24', 1000.00, 2000.00, 500.00, 1500.00, 50.00, 1, 1, NULL, '2025-01-17 12:32:31', '2025-01-17 12:32:31', 0);

-- --------------------------------------------------------

--
-- Structure de la table `budget`
--

CREATE TABLE `budget` (
  `id_budget` int(11) NOT NULL,
  `id_tache` int(11) DEFAULT NULL,
  `id_controle` int(11) DEFAULT NULL,
  `id_projet` int(11) DEFAULT NULL,
  `article` varchar(255) NOT NULL,
  `quantite_demande` int(11) DEFAULT NULL,
  `quantite_validee` int(11) DEFAULT NULL,
  `prix_unitaire` decimal(10,2) NOT NULL,
  `montant` decimal(15,2) DEFAULT NULL,
  `id_offre` int(255) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `montant_valide` decimal(15,2) GENERATED ALWAYS AS (`quantite_validee` * `prix_unitaire`) STORED,
  `user_cr` int(11) DEFAULT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `budgets`
--

CREATE TABLE `budgets` (
  `id_budget` int(11) NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `date_allocation` date DEFAULT NULL,
  `id_besoin` int(11) DEFAULT NULL,
  `id_projet` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `budgets`
--

INSERT INTO `budgets` (`id_budget`, `montant`, `date_allocation`, `id_besoin`, `id_projet`) VALUES
(1, 100.00, NULL, NULL, 1),
(2, 100.00, NULL, NULL, 2),
(3, 100.00, NULL, NULL, 3),
(4, 100.00, NULL, NULL, 4),
(5, 200.00, NULL, NULL, 5),
(6, 200.00, NULL, NULL, 6),
(7, 100.00, NULL, NULL, 7),
(8, 0.00, NULL, NULL, 8),
(9, 0.00, NULL, NULL, 9),
(10, 0.00, NULL, NULL, 10),
(11, 0.00, NULL, NULL, 11),
(12, 0.00, NULL, NULL, 12),
(13, 0.00, NULL, NULL, 13),
(14, 0.00, NULL, NULL, 14),
(15, 0.00, NULL, NULL, 15),
(16, 100.00, NULL, NULL, 16),
(17, 0.00, NULL, NULL, 17),
(18, 0.00, NULL, NULL, 18),
(19, 0.00, NULL, NULL, 19),
(20, 0.00, NULL, NULL, 20),
(21, 0.00, NULL, NULL, 21),
(22, 0.00, NULL, NULL, 22),
(23, 0.00, NULL, NULL, 23),
(24, 0.00, NULL, NULL, 24),
(25, 0.00, NULL, NULL, 25),
(26, 0.00, NULL, NULL, 26),
(27, 0.00, NULL, NULL, 27);

-- --------------------------------------------------------

--
-- Structure de la table `budgets_tag`
--

CREATE TABLE `budgets_tag` (
  `id_budget` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `bureaux`
--

CREATE TABLE `bureaux` (
  `id_bureau` int(11) NOT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `longueur` decimal(10,2) DEFAULT NULL,
  `largeur` decimal(10,2) DEFAULT NULL,
  `hauteur` decimal(10,2) DEFAULT NULL,
  `nombre_postes` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `bureaux`
--

INSERT INTO `bureaux` (`id_bureau`, `id_batiment`, `nom`, `longueur`, `largeur`, `hauteur`, `nombre_postes`, `date_creation`, `date_modification`, `est_supprime`) VALUES
(1, 2, 'Bureau 1vv', 10000.00, 800.00, 400.00, 20, '2024-09-30 14:28:52', '2024-11-19 14:56:29', 0),
(4, 1, 'Bureau 2', 800.00, 400.00, 200.00, 4, '2024-09-30 14:33:13', '2024-09-30 14:33:13', 0),
(5, 1, 'Bureau10', 1000.00, 800.00, 400.00, 10, '2024-10-03 14:45:20', '2024-11-19 15:17:00', 1);

-- --------------------------------------------------------

--
-- Structure de la table `cat client`
--

CREATE TABLE `cat client` (
  `id_cat_client` int(11) NOT NULL,
  `id_type_cat_client` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id_categorie` int(11) NOT NULL,
  `nom_cat` varchar(200) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id_categorie`, `nom_cat`, `date_creation`) VALUES
(1, 'Menuiserie', '2024-09-07 12:50:36'),
(2, 'Electronique', '2024-10-16 15:09:37'),
(3, 'Electricité', '2024-11-01 11:20:26'),
(4, 'Mécanique', '2024-11-01 11:42:17');

-- --------------------------------------------------------

--
-- Structure de la table `categorietache`
--

CREATE TABLE `categorietache` (
  `id_cat_tache` int(11) NOT NULL,
  `nom_cat_tache` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categorietache`
--

INSERT INTO `categorietache` (`id_cat_tache`, `nom_cat_tache`) VALUES
(1, 'Divers'),
(2, 'Inspection'),
(3, 'Réparation'),
(4, 'Achats'),
(5, 'Evaluation'),
(6, 'Maintenance préventive'),
(7, 'Nettoyage'),
(8, 'Formation'),
(9, 'Sécurité'),
(10, 'Logistique'),
(11, 'Amélioration continue'),
(12, 'Projets spéciaux'),
(13, 'Gestion des ressources'),
(14, 'Finance'),
(15, 'IT'),
(16, 'Juridique'),
(17, 'Procédures'),
(18, 'cccccc');

-- --------------------------------------------------------

--
-- Structure de la table `categorie_tache`
--

CREATE TABLE `categorie_tache` (
  `id_categorie_tache` int(11) NOT NULL,
  `id_tache` int(11) NOT NULL,
  `id_cat` int(11) NOT NULL,
  `cout` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categorie_tache`
--

INSERT INTO `categorie_tache` (`id_categorie_tache`, `id_tache`, `id_cat`, `cout`) VALUES
(1, 24, 1, 10.00),
(2, 24, 2, 50.00);

-- --------------------------------------------------------

--
-- Structure de la table `cat_inspection`
--

CREATE TABLE `cat_inspection` (
  `id_cat_inspection` int(11) NOT NULL,
  `nom_cat_inspection` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cat_inspection`
--

INSERT INTO `cat_inspection` (`id_cat_inspection`, `nom_cat_inspection`) VALUES
(1, 'Réparation'),
(2, 'Remplacement'),
(6, 'Suppression');

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id_client` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `pays` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `id_type_client` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `est_supprime` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id_client`, `nom`, `adresse`, `ville`, `pays`, `telephone`, `email`, `id_type_client`, `date_creation`, `date_modification`, `est_supprime`) VALUES
(1, 'KONNECT', NULL, NULL, NULL, NULL, NULL, 1, '2024-08-30 15:35:43', '2024-10-10 15:54:11', 0),
(2, 'VODACOM', NULL, NULL, NULL, NULL, NULL, 1, '2024-08-30 15:44:14', '2024-08-30 15:44:14', 0),
(3, 'COBRA', NULL, NULL, NULL, NULL, NULL, 1, '2024-08-30 15:44:41', '2024-08-30 15:44:41', 0),
(4, 'DISTRILOG', NULL, NULL, NULL, NULL, NULL, 1, '2024-08-30 15:45:24', '2024-08-30 15:45:24', 0),
(5, 'EASTCASTLE', NULL, NULL, NULL, NULL, NULL, 1, '2024-08-30 15:46:25', '2024-10-10 15:31:26', 0),
(6, 'BRACONGO', NULL, NULL, NULL, NULL, NULL, 1, '2024-08-30 15:46:53', '2024-08-30 15:46:53', 0),
(7, 'PPC', NULL, NULL, NULL, NULL, NULL, 1, '2024-08-30 15:47:16', '2024-08-30 15:47:16', 0),
(8, 'NETIS', NULL, NULL, NULL, NULL, NULL, 1, '2024-08-30 15:47:40', '2024-08-30 15:47:40', 0),
(9, 'PALETTES', NULL, NULL, NULL, NULL, NULL, 1, '2024-08-30 15:48:04', '2024-08-30 15:48:04', 0),
(10, 'Prod', 'Kinshasa, c/matete Q/ Kwenge, N°40', '1', NULL, '+243820689615', 'prod@gmail.com', 1, '2024-11-01 09:15:37', '2024-11-01 09:15:37', 0),
(11, 'Eco', 'Kinshasa, c/Lingwala Q/ Lac moero, N°40', '1', NULL, '+243820689615', 'eco@gmail.com', 1, '2024-11-01 09:19:01', '2024-11-01 09:19:01', 0);

-- --------------------------------------------------------

--
-- Structure de la table `contrat`
--

CREATE TABLE `contrat` (
  `id_contrat` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `type_contrat` varchar(255) NOT NULL,
  `statut` int(11) NOT NULL,
  `date_signature` date NOT NULL,
  `conditions` text DEFAULT NULL,
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contrat`
--

INSERT INTO `contrat` (`id_contrat`, `id_client`, `date_debut`, `date_fin`, `montant`, `type_contrat`, `statut`, `date_signature`, `conditions`, `date_modification`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-12-31', '2025-01-08', 2000.00, '1', 0, '2025-01-08', 'Contrat 1', '2025-01-09 12:39:44', '2025-01-09 12:39:44', '2025-01-09 12:39:44'),
(2, 2, '2025-01-08', '2025-01-28', 3000.00, '2', 0, '2025-01-30', 'Contrat 2', '2025-01-09 12:42:04', '2025-01-09 12:42:04', '2025-01-09 12:42:04'),
(3, 1, '2025-01-06', '2024-12-31', 200000.00, '2', 0, '2025-01-15', 'Contrat 5', '2025-01-09 13:09:57', '2025-01-09 13:09:57', '2025-01-09 13:09:57'),
(4, 3, '2024-12-31', '2025-01-08', 0.00, '6', 0, '2025-01-29', 'Contrat 122', '2025-01-09 13:14:19', '2025-01-09 13:14:19', '2025-01-09 13:14:19');

-- --------------------------------------------------------

--
-- Structure de la table `controles_de_base_tags`
--

CREATE TABLE `controles_de_base_tags` (
  `id_controle_de_base` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `controle_client`
--

CREATE TABLE `controle_client` (
  `id_controle_client` int(11) NOT NULL,
  `id_controle` int(11) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `controle_client`
--

INSERT INTO `controle_client` (`id_controle_client`, `id_controle`, `id_client`) VALUES
(2, 10, 4),
(3, 10, 1),
(4, 10, 3),
(5, 10, 2),
(6, 10, 5),
(7, 10, 6),
(8, 10, 7),
(9, 10, 8),
(10, 11, 2),
(13, 12, 1);

-- --------------------------------------------------------

--
-- Structure de la table `controle_de_base`
--

CREATE TABLE `controle_de_base` (
  `id_controle` int(11) NOT NULL,
  `id_departement` int(11) NOT NULL,
  `id_format` int(11) NOT NULL,
  `controle_de_base` text NOT NULL,
  `id_frequence` int(11) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_cr` int(11) DEFAULT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `controle_de_base`
--

INSERT INTO `controle_de_base` (`id_controle`, `id_departement`, `id_format`, `controle_de_base`, `id_frequence`, `date_creation`, `user_cr`, `est_supprime`) VALUES
(10, 5, 1, 'VALIDATION PC', 3, '2024-09-09 12:14:04', NULL, 0),
(11, 6, 3, 'TRACKING VODACOM', 3, '2024-09-09 12:25:47', NULL, 0),
(12, 6, 3, 'TRACKING KONNECTS', 3, '2024-09-09 14:26:03', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `controle_responsable`
--

CREATE TABLE `controle_responsable` (
  `id_controle_responsable` int(11) NOT NULL,
  `id_controle` int(11) NOT NULL,
  `id_responsable` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `controle_responsable`
--

INSERT INTO `controle_responsable` (`id_controle_responsable`, `id_controle`, `id_responsable`) VALUES
(5, 10, 6),
(6, 11, 6),
(7, 11, 7),
(10, 12, 9);

-- --------------------------------------------------------

--
-- Structure de la table `corpsmetier`
--

CREATE TABLE `corpsmetier` (
  `id_corps_metier` int(11) NOT NULL,
  `nom_corps_metier` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `corpsmetier`
--

INSERT INTO `corpsmetier` (`id_corps_metier`, `nom_corps_metier`) VALUES
(1, 'Electricité'),
(2, 'Menuiserie'),
(3, 'Plomberie'),
(4, 'Maçonnerie'),
(5, 'Peinture'),
(6, 'Climatisation et chauffage'),
(7, 'Serrurerie'),
(8, 'Jardinage et espaces verts'),
(9, 'Revêtement de sol'),
(10, 'Tôlerie et métallurgie'),
(11, 'Vitrerie'),
(12, 'Gestion des déchets'),
(13, 'Entretien mécanique'),
(14, 'Systèmes de sécurité(alarme, vidéosurveillance)'),
(15, 'Soudure'),
(16, 'Gestion des fluides'),
(17, 'Réseaux informatiques et télécommunications'),
(18, 'Maintenance industrielle'),
(19, 'Système d\'éclairage'),
(20, 'Energies renouvelables'),
(21, 'Gestion des stocks'),
(22, 'Manutention'),
(23, 'Préparation de commandes'),
(24, 'Transport et livraison'),
(25, 'Gestion des flux entrants et sortants'),
(26, 'Chargement et déchargement'),
(27, 'Optimisation des espaces de stockage'),
(28, 'Gestion des emballages'),
(29, 'Maintenance des chariots élévateurs et transpalettes'),
(30, 'Gestion des inventaires'),
(31, 'Logistique des retours'),
(32, 'Gestion des matières dangereuses'),
(33, 'Gestion des équipements de protection individuelle (EPI)'),
(34, 'Contrôle qualité logistique'),
(35, 'Gestion des systèmes de gestion d\'entrepôt(WMS)'),
(36, 'Sécurité incendie et évacuation dans les entrepôts'),
(37, 'Maintenance des racks de stockage'),
(38, 'Gestion des transports frigorifiques'),
(39, 'Traçabilités des produits'),
(40, 'Gestion des conteneurs et palettes'),
(41, 'dcdd');

-- --------------------------------------------------------

--
-- Structure de la table `declaration_super`
--

CREATE TABLE `declaration_super` (
  `id_declaration_super` int(11) NOT NULL,
  `id_template` int(11) NOT NULL,
  `periode` date DEFAULT NULL,
  `m2_occupe` decimal(10,0) DEFAULT NULL,
  `m2_facture` decimal(10,0) DEFAULT NULL,
  `tarif_entreposage` decimal(10,0) DEFAULT NULL,
  `entreposage` decimal(10,0) DEFAULT NULL,
  `debours_entreposage` decimal(10,0) DEFAULT NULL,
  `total_entreposage` decimal(10,0) DEFAULT NULL,
  `ttc_entreposage` decimal(10,0) DEFAULT NULL,
  `desc_entreposage` text DEFAULT NULL,
  `id_ville` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `id_objet` int(11) DEFAULT NULL,
  `manutation` decimal(10,0) DEFAULT NULL,
  `tarif_manutation` decimal(10,0) DEFAULT NULL,
  `debours_manutation` decimal(10,0) DEFAULT NULL,
  `total_manutation` decimal(10,0) DEFAULT NULL,
  `ttc_manutation` int(11) DEFAULT NULL,
  `desc_manutation` text DEFAULT NULL,
  `user_cr` int(11) DEFAULT 3,
  `id_statut_decl` int(11) NOT NULL DEFAULT 1,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `declaration_super`
--

INSERT INTO `declaration_super` (`id_declaration_super`, `id_template`, `periode`, `m2_occupe`, `m2_facture`, `tarif_entreposage`, `entreposage`, `debours_entreposage`, `total_entreposage`, `ttc_entreposage`, `desc_entreposage`, `id_ville`, `id_client`, `id_batiment`, `id_objet`, `manutation`, `tarif_manutation`, `debours_manutation`, `total_manutation`, `ttc_manutation`, `desc_manutation`, `user_cr`, `id_statut_decl`, `date_creation`, `date_modification`, `est_supprime`) VALUES
(17, 10, '2025-01-11', NULL, 25, 100, 15, NULL, 2515, 2917, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-01-13 14:52:27', '2025-03-03 10:47:15', 0),
(18, 11, '2025-02-03', NULL, 10, 10, 10, NULL, 110, 128, NULL, 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-01-13 15:06:48', '2025-03-03 10:40:04', 0),
(19, 10, '2025-02-03', NULL, 15, 15, 15, NULL, 240, 278, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-01-13 15:18:09', '2025-03-03 10:40:04', 0),
(20, 10, '2025-03-03', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-01-15 14:15:23', '2025-01-15 14:15:23', 0),
(21, 11, '2025-01-03', NULL, 20, 10, 5, NULL, 205, 238, NULL, 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-01-15 14:42:09', '2025-03-03 10:47:15', 0),
(22, 11, '2025-03-03', NULL, 100, 25, 18, 20, 2518, 2921, 'DESC 1', 1, 1, NULL, NULL, 10, 20, 15, 2100, 2200, 'DESC 2', NULL, 1, '2025-01-15 14:46:15', '2025-01-15 14:46:15', 0),
(23, 8, '2025-04-03', 20, 10, 5, 10, NULL, 60, 70, NULL, 1, 1, NULL, 2, 4, 10, 5, 104, 121, NULL, NULL, 1, '2025-01-30 13:44:00', '2025-01-30 13:44:00', 0),
(24, 8, '2025-05-03', NULL, 20, 1, 10, 5, 30, 35, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 2, '2025-01-30 13:45:16', '2025-03-03 10:38:21', 0),
(25, 8, '2025-06-03', 10, 25, 15, 19, NULL, 394, 457, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 2, '2025-01-30 13:46:34', '2025-03-03 10:26:00', 0),
(26, 10, '2025-06-03', 10, 25, 6, 15, 5, 165, 191, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 2, '2025-01-30 13:48:48', '2025-03-03 10:26:00', 0),
(27, 10, '2025-07-03', 10, 12, 5, 10, 5, 70, 81, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 2, '2025-01-30 13:57:50', '2025-03-03 10:25:14', 0),
(28, 10, '2024-07-03', 10, 12, 5, 10, 5, 70, 81, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 2, '2025-02-03 12:09:12', '2025-03-03 10:21:43', 0),
(29, 10, '2051-07-03', 10, 25, 6, 15, 5, 165, 191, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, 3, 2, '2025-02-21 12:09:24', '2025-03-03 10:19:02', 0),
(30, 10, '2025-11-03', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, 1, 3, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, 7, 2, '2025-02-21 12:22:18', '2025-03-03 09:45:00', 0),
(31, 10, '2025-08-03', 50, 80, 20, 10, NULL, 1610, 1868, NULL, 1, 3, NULL, 2, 50, 10, 50, 850, 986, NULL, 7, 2, '2025-02-21 13:53:09', '2025-02-25 12:53:38', 0),
(32, 11, '2025-12-03', 400, 400, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7, 1, '2025-03-04 15:08:22', '2025-03-04 15:08:22', 0),
(33, 11, '2025-11-03', 100, 100, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7, 1, '2025-03-04 15:09:22', '2025-03-04 15:09:22', 0),
(34, 11, '2025-10-03', 150, 150, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7, 1, '2025-03-04 15:12:53', '2025-03-04 15:12:53', 0),
(35, 11, '2025-09-03', 250, 250, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7, 1, '2025-03-04 15:13:26', '2025-03-04 15:13:26', 0);

-- --------------------------------------------------------

--
-- Structure de la table `declaration_superficie`
--

CREATE TABLE `declaration_superficie` (
  `id_declaration_superficie` int(11) NOT NULL,
  `type_activite` enum('entreposage','manutention') DEFAULT NULL,
  `id_template_occu` int(11) NOT NULL,
  `periode` date DEFAULT NULL,
  `debours` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `ttc` decimal(10,2) DEFAULT NULL,
  `observation` text DEFAULT NULL,
  `m2_occupe` decimal(10,2) DEFAULT NULL,
  `m2_facture` decimal(10,2) DEFAULT NULL,
  `tarif_entreposage` decimal(10,2) DEFAULT NULL,
  `id_ville` int(11) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `id_objet` int(11) DEFAULT NULL,
  `manutention` decimal(10,2) DEFAULT NULL,
  `tarif_manutention` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `declaration_super_batiment`
--

CREATE TABLE `declaration_super_batiment` (
  `id_declaration_super_batiment` int(11) NOT NULL,
  `id_declaration_super` int(11) NOT NULL,
  `id_batiment` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `declaration_super_batiment`
--

INSERT INTO `declaration_super_batiment` (`id_declaration_super_batiment`, `id_declaration_super`, `id_batiment`) VALUES
(5, 23, 1);

-- --------------------------------------------------------

--
-- Structure de la table `denomination_bat`
--

CREATE TABLE `denomination_bat` (
  `id_denomination_bat` int(11) NOT NULL,
  `id_batiment` int(11) NOT NULL,
  `nom_denomination_bat` varchar(200) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `denomination_bat`
--

INSERT INTO `denomination_bat` (`id_denomination_bat`, `id_batiment`, `nom_denomination_bat`, `date_creation`, `est_supprime`) VALUES
(1, 3, 'Denomination 11', '2022-12-31 23:00:00', 1),
(2, 5, 'Den 1', '2022-12-31 23:00:00', 0),
(3, 5, 'Den 2', '2022-12-31 23:00:00', 0),
(4, 1, 'Denomination 11222', '2022-12-31 23:00:00', 0),
(5, 1, 'tite', '2022-12-31 23:00:00', 0),
(6, 1, 'Denomination 1ACCCCC', '2022-12-31 23:00:00', 0),
(7, 1, 'ACHHHHH DENOM2', '2022-12-31 23:00:00', 0),
(8, 1, 'Denomination cobra 1', '2022-12-31 23:00:00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `departement`
--

CREATE TABLE `departement` (
  `id_departement` int(11) NOT NULL,
  `nom_departement` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `code` varchar(10) NOT NULL,
  `responsable` int(11) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `date_creation` date DEFAULT NULL,
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `departement`
--

INSERT INTO `departement` (`id_departement`, `nom_departement`, `description`, `code`, `responsable`, `telephone`, `email`, `date_creation`, `date_modification`, `est_supprime`) VALUES
(5, 'WHSE', '', '0008', 7, NULL, NULL, NULL, '2024-10-10 11:58:46', 0),
(6, 'DLOG', NULL, '0009', 6, '+243815127387', 'jcliomba@gtmdrc.com', NULL, '2024-09-09 08:00:20', 0),
(7, 'QSHE', NULL, '0010', 12, NULL, NULL, NULL, '2024-11-26 10:42:23', 0),
(8, 'ADC', NULL, '0011', 10, NULL, NULL, NULL, '2024-10-31 12:58:23', 0),
(9, 'HDG', NULL, '0012', 4, NULL, NULL, NULL, '2024-11-26 10:42:46', 0);

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

CREATE TABLE `documents` (
  `id_document` int(11) NOT NULL,
  `nom_document` varchar(200) NOT NULL,
  `type_document` varchar(100) DEFAULT NULL,
  `chemin_document` varchar(255) DEFAULT NULL,
  `id_offre` int(11) DEFAULT NULL,
  `id_tache` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `documents`
--

INSERT INTO `documents` (`id_document`, `nom_document`, `type_document`, `chemin_document`, `id_offre`, `id_tache`, `date_creation`) VALUES
(2, 'image12', 'Image', 'public/uploads/71db077c-6254-460e-a1b7-b0389fb9fe09.jpg', NULL, NULL, '2024-09-19 14:11:57'),
(3, 'word.dox', 'Word', 'public/uploads/db3abbcb-78c5-4c1d-b718-fbd04e009b51.doc', NULL, NULL, '2024-09-19 16:01:14'),
(4, 'word.dox', 'Word', 'public/uploads/bba15379-0379-4db6-974f-155a3c3be95e.doc', NULL, NULL, '2024-09-19 16:01:14');

-- --------------------------------------------------------

--
-- Structure de la table `documents_batiment`
--

CREATE TABLE `documents_batiment` (
  `id_document` int(11) NOT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `nom_document` varchar(255) NOT NULL,
  `type_document` varchar(50) DEFAULT NULL,
  `chemin_document` varchar(255) NOT NULL,
  `date_ajout` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `documents_batiment`
--

INSERT INTO `documents_batiment` (`id_document`, `id_batiment`, `nom_document`, `type_document`, `chemin_document`, `date_ajout`) VALUES
(2, 1, 'word1', 'Word', 'public/uploads/9c100a5a-487d-48ef-915b-e60a160f3e7f.doc', '2024-09-25 10:43:17');

-- --------------------------------------------------------

--
-- Structure de la table `documents_offre`
--

CREATE TABLE `documents_offre` (
  `id_document` int(11) NOT NULL,
  `id_offre` int(11) DEFAULT NULL,
  `nom_document` varchar(255) NOT NULL,
  `type_document` varchar(50) DEFAULT NULL,
  `chemin_document` varchar(255) NOT NULL,
  `date_ajout` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `documents_offre`
--

INSERT INTO `documents_offre` (`id_document`, `id_offre`, `nom_document`, `type_document`, `chemin_document`, `date_ajout`) VALUES
(1, 1, 'word', 'Word', 'public/uploads/f60f523e-aa1e-4341-92ef-7be7ed159455.doc', '2024-09-12 14:22:16'),
(2, 1, 'image V', 'Image', 'public/uploads/eafda16b-949b-4d06-85e2-5d457aa58e66.png', '2024-09-13 16:35:17');

-- --------------------------------------------------------

--
-- Structure de la table `document_projet`
--

CREATE TABLE `document_projet` (
  `id_document` int(11) NOT NULL,
  `id_projet` int(11) NOT NULL,
  `nom_document` varchar(200) NOT NULL,
  `type_document` varchar(50) DEFAULT NULL,
  `ref` varchar(200) DEFAULT NULL,
  `chemin_document` varchar(255) NOT NULL,
  `date_ajout` datetime DEFAULT current_timestamp(),
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `document_projet`
--

INSERT INTO `document_projet` (`id_document`, `id_projet`, `nom_document`, `type_document`, `ref`, `chemin_document`, `date_ajout`, `est_supprime`) VALUES
(1, 25, 'word 11', 'Word', 'WORD 11', 'public/uploads/988b63e8-0a10-49d7-91b2-52d348e5c4ab.doc', '2024-10-14 12:02:31', 0),
(2, 27, 'word.dox', 'Word', '1222', 'public/uploads/4904f2ce-1907-4a29-9804-7a37835a1930.docx', '2024-12-12 15:09:10', 0),
(3, 27, 'cddd', 'Word', '12333', 'public/uploads/c3ec30bf-e5aa-4841-986c-14d1031ada5c.docx', '2024-12-12 15:14:22', 0);

-- --------------------------------------------------------

--
-- Structure de la table `entrepots`
--

CREATE TABLE `entrepots` (
  `id` int(11) NOT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `entrepots`
--

INSERT INTO `entrepots` (`id`, `id_batiment`, `nom`, `description`, `date_creation`, `date_modification`) VALUES
(3, 2, 'Entrepot2', NULL, '2024-10-02 12:49:42', '2024-10-03 11:13:20'),
(4, 3, 'Entrepot4', 'DDDDDDDDDDDDD', '2024-10-02 12:51:37', '2024-10-03 11:22:03'),
(5, 2, 'Entrepot3', NULL, '2024-10-02 12:52:52', '2024-10-02 12:52:52'),
(6, 3, 'Entrepot4', NULL, '2024-10-02 12:57:09', '2024-10-02 12:57:09'),
(7, 2, 'Entrepot1', NULL, '2024-10-02 14:38:47', '2024-10-02 14:38:47');

-- --------------------------------------------------------

--
-- Structure de la table `equipments`
--

CREATE TABLE `equipments` (
  `id_equipement` int(11) NOT NULL,
  `id_bureau` int(11) DEFAULT NULL,
  `id_bin` int(11) DEFAULT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `id_type_equipement` int(11) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `num_serie` varchar(255) DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  `maintenance_date` date DEFAULT NULL,
  `date_prochaine_maintenance` date DEFAULT NULL,
  `location` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `equipments`
--

INSERT INTO `equipments` (`id_equipement`, `id_bureau`, `id_bin`, `id_batiment`, `id_type_equipement`, `model`, `num_serie`, `installation_date`, `maintenance_date`, `date_prochaine_maintenance`, `location`, `status`, `created_at`, `updated_at`) VALUES
(13, NULL, 5, 3, 2, '303F', 'f222', '2025-01-16', '2025-01-16', '2025-02-07', 2, 2, '2025-01-17 13:12:33', '2025-01-17 13:12:33');

-- --------------------------------------------------------

--
-- Structure de la table `format`
--

CREATE TABLE `format` (
  `id_format` int(11) NOT NULL,
  `nom_format` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `id_user` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `format`
--

INSERT INTO `format` (`id_format`, `nom_format`, `description`, `id_user`, `created_at`, `updated_at`) VALUES
(1, 'PAPIER', NULL, NULL, '2024-08-21 10:30:20', '2024-08-21 10:30:20'),
(2, 'MAIL', NULL, NULL, '2024-08-21 10:30:20', '2024-08-21 10:30:20'),
(3, 'FMP', NULL, NULL, '2024-08-21 10:30:20', '2024-08-21 10:30:20'),
(4, 'REUNION', NULL, NULL, '2024-08-21 10:30:20', '2024-08-21 10:30:20'),
(5, 'WHATSAPP', NULL, NULL, '2024-08-21 10:30:20', '2024-08-21 10:30:20');

-- --------------------------------------------------------

--
-- Structure de la table `fournisseur`
--

CREATE TABLE `fournisseur` (
  `id_fournisseur` int(11) NOT NULL,
  `nom_fournisseur` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `fournisseur`
--

INSERT INTO `fournisseur` (`id_fournisseur`, `nom_fournisseur`, `telephone`, `email`, `adresse`, `ville`, `pays`, `date_ajout`, `date_modification`) VALUES
(1, 'Food Market', NULL, NULL, 'Kinshasa, C/ Gombe', '1', NULL, '2024-09-07 12:55:27', '2024-09-07 12:55:27'),
(2, 'Kin Mark', '+243820689615', NULL, 'Gombe', '1', NULL, '2024-09-07 12:56:29', '2024-09-07 12:56:29');

-- --------------------------------------------------------

--
-- Structure de la table `frequence`
--

CREATE TABLE `frequence` (
  `id_frequence` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `intervalle` int(11) DEFAULT NULL,
  `unite` varchar(255) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `frequence`
--

INSERT INTO `frequence` (`id_frequence`, `nom`, `intervalle`, `unite`, `date_debut`, `date_fin`, `date_creation`, `date_modification`) VALUES
(1, 'Daily', NULL, NULL, NULL, NULL, '2024-08-21 09:55:31', '2024-09-17 13:41:16'),
(2, 'Lundi', NULL, NULL, NULL, NULL, '2024-08-21 09:55:31', '2024-08-21 09:55:31'),
(3, 'Mensuelle', 1, 'mois', '2024-01-01', '2024-12-31', '2024-08-21 09:55:31', '2024-08-21 09:55:31'),
(4, 'Trimestrielle', 3, 'mois', NULL, NULL, '2024-08-21 09:55:31', '2024-08-21 09:55:31'),
(5, 'Fin du mois', NULL, NULL, NULL, NULL, '2024-08-21 09:55:31', '2024-08-21 09:55:31'),
(6, 'Mardi', NULL, NULL, NULL, NULL, '2024-08-21 09:55:31', '2024-08-21 09:55:31'),
(7, 'Mercredi', NULL, NULL, NULL, NULL, '2024-08-21 09:55:31', '2024-08-21 09:55:31'),
(8, 'Jeudi', NULL, NULL, NULL, NULL, '2024-08-21 09:55:31', '2024-08-21 09:55:31'),
(9, 'Vendredi', NULL, NULL, NULL, NULL, '2024-08-21 09:55:31', '2024-08-21 09:55:31'),
(10, 'Samedi', NULL, NULL, NULL, NULL, '2024-08-21 09:55:31', '2024-08-21 09:55:31'),
(11, 'Mois', NULL, NULL, NULL, NULL, '2024-08-30 15:49:47', '2024-08-30 15:49:47');

-- --------------------------------------------------------

--
-- Structure de la table `inspections`
--

CREATE TABLE `inspections` (
  `id_inspection` int(11) NOT NULL,
  `id_tache` int(11) DEFAULT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `id_cat_instruction` int(11) DEFAULT NULL,
  `id_type_instruction` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `inspections`
--

INSERT INTO `inspections` (`id_inspection`, `id_tache`, `id_batiment`, `id_cat_instruction`, `id_type_instruction`, `date_creation`, `date_modification`, `est_supprime`) VALUES
(18, 26, 1, 1, 1, '2024-11-21 12:13:06', '2024-11-22 10:24:42', 0),
(19, NULL, 8, 1, 1, '2024-11-26 08:42:12', '2024-11-26 08:42:12', 0),
(20, 31, 9, 2, 1, '2024-11-26 08:47:26', '2024-11-26 08:47:26', 0),
(21, 0, 1, 1, 1, '2024-12-11 10:57:07', '2024-12-11 10:57:07', 0),
(22, 0, 3, 1, 1, '2024-12-11 10:58:12', '2024-12-11 10:58:12', 0),
(23, 0, 1, 1, 1, '2024-12-11 11:34:51', '2024-12-11 11:34:51', 0),
(24, 0, 3, 1, 1, '2024-12-11 11:48:15', '2024-12-11 11:48:15', 0),
(25, 0, 8, 1, 1, '2024-12-11 11:55:50', '2024-12-11 11:55:50', 0),
(26, 0, 3, 1, 1, '2024-12-11 12:11:57', '2024-12-11 12:11:57', 0),
(27, 0, 1, 1, 1, '2024-12-11 12:50:15', '2024-12-11 12:50:15', 0),
(28, 0, 1, 1, 1, '2024-12-11 12:57:28', '2024-12-11 12:57:28', 0),
(29, 0, 3, 1, 1, '2024-12-11 13:22:44', '2024-12-11 13:22:44', 0),
(30, 0, 3, 1, 1, '2024-12-11 13:29:32', '2024-12-11 13:29:32', 0),
(31, 0, 7, 1, 1, '2024-12-11 13:46:30', '2024-12-11 13:46:30', 0),
(32, 0, 8, 2, 1, '2024-12-11 13:59:00', '2024-12-11 13:59:00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `inspection_img`
--

CREATE TABLE `inspection_img` (
  `id_inspection_img` int(11) NOT NULL,
  `id_inspection` int(11) DEFAULT NULL,
  `id_type_photo` int(11) DEFAULT NULL,
  `img` text DEFAULT NULL,
  `commentaire` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `inspection_img`
--

INSERT INTO `inspection_img` (`id_inspection_img`, `id_inspection`, `id_type_photo`, `img`, `commentaire`) VALUES
(16, 18, 1, 'public/uploads/73a47fd0-04b8-4a63-978a-838f27649eb6.png', 'comm22'),
(17, 18, 1, 'public/uploads/d6620689-be8d-4666-a8ca-03be9ae793fe.png', 'comm22'),
(18, 18, 2, 'public/uploads/0472c444-879d-4a23-8178-ade8b9d51e58.png', 'comm 33'),
(19, 19, 1, 'public/uploads/cf06c88f-9344-4a5f-8368-9594724653ba.png', 'Commentaire 20 bat'),
(20, 19, 1, 'public/uploads/5b055750-089c-4287-907f-ddc55496ee56.png', 'Commentaire 20 bat'),
(21, 20, 1, 'public/uploads/d1e4ce01-062e-426d-89f7-a4581209cdff.png', 'Bat 5 commentaire '),
(22, 21, 1, 'public/uploads/72baa7c1-18b2-4272-81cf-16b7e4bc280f.png', 'cvvvvvvvvvvvvv'),
(23, 22, 1, 'public/uploads/08f147f6-2398-4d03-801f-af1696d4301e.png', 'aaaaaaaa'),
(24, 23, 1, 'public/uploads/12faadd6-025e-416b-9d72-78d82ca48ff6.png', 'xxcccc'),
(25, 24, 1, 'public/uploads/86cfb8fc-07a2-43aa-8b75-2c5ec260c699.png', 'ggg'),
(26, 24, 1, 'public/uploads/52f7f838-e2c6-410a-ac29-f0a140d7a195.png', 'ggg'),
(27, 25, 1, 'public/uploads/00adc413-588f-4c8b-b3d7-8b9574c91f06.png', 'yyy'),
(28, 26, 1, 'public/uploads/a14929e5-268e-433b-95db-9c63e6919573.png', 'fff'),
(29, 27, 1, 'public/uploads/73777d36-cff8-4bf7-b45f-b2fb63226179.png', 'attention'),
(30, 28, 1, 'public/uploads/61dcce17-693d-43b6-8766-b0ba77f06f7d.jpeg', 'D\'eau'),
(31, 28, 1, 'public/uploads/bdb50187-0e7a-4407-9c55-08711c6ddfb2.png', 'D\'eau'),
(32, 29, 1, 'public/uploads/d7f50c65-5bd5-4212-9403-0e294248295c.png', 'vddd'),
(33, 30, 1, 'public/uploads/0f3436ba-7d4e-4241-806d-6a5ce7a8a5c8.png', 'FDDDD'),
(34, 31, 1, 'public/uploads/1dc070ee-51a1-423c-ab84-0d19b067b050.png', 'gffff'),
(35, 32, 1, 'public/uploads/e8d37dd2-6312-4e3e-8de7-6bdd503e985c.png', 'GFGFGF');

-- --------------------------------------------------------

--
-- Structure de la table `maintenances_bins`
--

CREATE TABLE `maintenances_bins` (
  `id` int(11) NOT NULL,
  `id_bin` int(11) DEFAULT NULL,
  `description` text NOT NULL,
  `date_intervention` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `maintenance_logs`
--

CREATE TABLE `maintenance_logs` (
  `id_maintenance` int(11) NOT NULL,
  `id_equipement` int(11) NOT NULL,
  `maintenance_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `id_technicien` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `index` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `menus`
--

INSERT INTO `menus` (`id`, `title`, `url`, `icon`, `index`) VALUES
(2, 'Département', '/departement', 'ApartmentOutlined', NULL),
(3, 'Contrôle de base', '/controle', 'DashboardOutlined', NULL),
(4, 'Bâtiment', '/batiment', 'BankOutlined', NULL),
(5, 'Projet', '/projet', 'ProjectOutlined', NULL),
(6, 'Tâches', '/tache', 'FileDoneOutlined', NULL),
(7, 'Articles', '/article', 'TagOutlined', NULL),
(8, 'Stock', '/stock', 'DropboxOutlined', NULL),
(9, 'Document', '/dossier', 'FileTextOutlined', NULL),
(10, 'Tags', '/tags', 'TagsOutlined', NULL),
(11, 'Paramètre', '/parametre', 'SettingOutlined', NULL),
(12, 'Template', '/template', 'ScheduleOutlined', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `niveau_batiment`
--

CREATE TABLE `niveau_batiment` (
  `id_niveau` int(11) NOT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `nom_niveau` varchar(200) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `niveau_batiment`
--

INSERT INTO `niveau_batiment` (`id_niveau`, `id_batiment`, `nom_niveau`, `date_creation`, `date_modification`, `est_supprime`) VALUES
(1, NULL, '', '2024-11-04 13:24:45', '2024-11-13 12:28:49', 0),
(2, 6, 'NIV11', '2024-11-11 13:31:14', '2024-11-13 12:53:55', 1),
(3, 6, 'Niv2', '2024-11-11 13:31:14', '2024-11-11 13:31:14', 0),
(4, 6, 'Niv3', '2024-11-11 13:31:14', '2024-11-11 13:31:14', 0),
(5, 8, 'Niv1', '2024-11-11 13:38:36', '2024-11-11 13:38:36', 0),
(6, 8, 'Niv2', '2024-11-11 13:38:36', '2024-11-11 13:38:36', 0),
(7, 8, 'Niv3', '2024-11-11 13:38:36', '2024-11-11 13:38:36', 0),
(8, 5, 'niveau221', '2024-11-14 14:22:51', '2024-11-14 14:22:51', 0),
(9, 3, 'niveau 202', '2025-01-04 11:54:28', '2025-01-04 11:54:28', 0),
(10, 1, 'niveau Konnect 2', '2025-01-04 12:03:52', '2025-01-04 12:03:52', 0),
(11, 1, 'niveau 1 batiment 1', '2025-01-04 12:06:07', '2025-01-04 12:06:07', 0);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id_notifications` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id_notifications`, `user_id`, `message`, `timestamp`, `is_read`) VALUES
(17, 12, 'Vous avez ajouté une tâche : dddddddddddd', '2024-11-27 15:27:34', 1),
(18, 12, 'Vous avez ajouté une tâche : FFFFFFFFFFFF', '2024-11-27 15:33:37', 1),
(19, 12, 'Vous avez ajouté  tâche : JJJJJJJ', '2024-11-27 15:35:40', 1),
(20, 3, 'Vous avez ajouté une tâche : BVVVV', '2024-11-27 15:37:33', 1),
(21, 3, 'Vous avez ajouté une tâche : fdddd', '2024-11-27 15:39:24', 1),
(22, 3, 'Vous avez ajouté une tâche : vvvvvvvvvvvv', '2024-11-27 15:41:04', 1),
(23, 3, 'Vous avez ajouté une tâche : bdddddddddddd', '2024-11-27 15:43:08', 1),
(24, 3, 'Une nouvelle tâche vient d\'être créée avec le titre de : hgggg', '2024-11-28 11:30:14', 1),
(25, 12, 'Une nouvelle tâche vient d\'être créée avec le titre de : fdezzzzz', '2024-11-28 11:31:33', 1),
(26, 12, 'Une nouvelle tâche vient d\'être créée avec le titre de : trrrrrr', '2024-11-28 11:40:25', 1),
(27, 3, 'Une nouvelle tâche vient d\'être créée avec le titre de : trrrrrrrrrr', '2024-11-28 11:47:25', 1),
(28, 12, 'Une nouvelle tâche vient d\'être créée avec le titre de : YYYYYYYYYYY', '2024-11-28 11:48:14', 1),
(29, 12, 'Une nouvelle tâche vient d\'être créée avec le titre de : kkkkkk', '2024-11-28 12:01:41', 1),
(30, 12, 'Vous avez reçu un accès au menu avec l\'ID 2.', '2024-11-28 13:44:32', 1),
(31, 12, 'Vous avez reçu un accès au menu avec l\'ID 2.', '2024-11-28 13:44:33', 1),
(32, 12, 'Vous avez reçu un accès au menu avec l\'ID 2.', '2024-11-28 13:44:34', 1),
(33, 12, '3', '2024-11-28 13:59:26', 1),
(34, 12, '3', '2024-11-28 13:59:27', 1),
(35, 12, '3', '2024-11-28 13:59:28', 1),
(36, 12, 'Vos permissions pour une tâche ont été mises à jour.', '2024-11-28 14:03:10', 1),
(37, 12, 'Vos permissions pour une tâche ont été mises à jour.', '2024-11-28 14:03:12', 1),
(38, 12, 'Vos permissions pour une tâche ont été mises à jour.', '2024-11-28 14:03:13', 1),
(39, 12, 'Vous avez reçu un accès à une nouvelle tâche.', '2024-11-28 14:07:07', 1),
(40, 12, 'Vos permissions pour une tâche ont été mises à jour.', '2024-11-28 14:07:08', 1),
(41, 12, 'Vos permissions pour une tâche ont été mises à jour.', '2024-11-28 14:07:09', 1),
(42, 3, 'Une nouvelle tâche vient d\'être créée avec le titre de : vccccc', '2024-11-28 14:17:15', 1),
(43, 3, 'Une nouvelle tâche vient d\'être créée avec le titre de : zzeeeeeeeeee', '2024-11-28 14:18:23', 1),
(44, 3, 'Une nouvelle tâche vient d\'être créée avec le titre de : xxccccccc', '2024-11-28 14:19:34', 1),
(45, 12, 'Une nouvelle tâche vient d\'être créée avec le titre de : RTEERRR', '2024-11-28 14:28:44', 1),
(46, 3, 'Une nouvelle tâche vient d\'être créée avec le titre de : gggg', '2024-12-12 15:08:00', 1),
(47, 3, 'Une nouvelle tâche vient d\'être créée avec le titre de : dcddd', '2024-12-12 15:14:50', 1),
(48, 3, 'Une nouvelle tâche vient d\'être créée avec le titre de : fgffff', '2024-12-12 15:25:31', 1),
(49, 3, 'Une nouvelle tâche vient d\'être créée avec le titre de : re300', '2024-12-12 15:27:03', 1),
(50, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-20 14:22:59', 1),
(51, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-20 14:23:14', 1),
(52, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-20 14:23:31', 1),
(53, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-20 14:23:38', 1),
(54, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-20 14:25:13', 1),
(55, 3, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-20 14:27:07', 1),
(56, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-20 14:27:14', 1),
(57, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-20 14:28:50', 1),
(58, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-20 14:28:51', 1),
(59, 3, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-20 14:31:37', 1),
(60, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-20 14:31:46', 1),
(61, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-20 14:32:14', 1),
(62, 0, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 11:25:54', 0),
(63, 0, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 11:28:00', 0),
(64, 0, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 11:28:05', 0),
(65, 0, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 11:28:42', 0),
(66, 0, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 11:28:45', 0),
(67, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 11:56:43', 0),
(68, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 11:56:45', 0),
(69, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 11:56:50', 0),
(70, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:05:56', 0),
(71, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:05:57', 0),
(72, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:05:58', 0),
(73, 3, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 12:16:32', 0),
(74, 3, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:16:33', 0),
(75, 3, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:16:36', 0),
(76, 3, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 12:16:37', 0),
(77, 3, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:16:38', 0),
(78, 3, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:16:39', 0),
(79, 3, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 12:16:40', 0),
(80, 3, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:16:41', 0),
(81, 3, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:16:41', 0),
(82, 3, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 12:16:42', 0),
(83, 3, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:16:43', 0),
(84, 3, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:16:44', 0),
(85, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:21:25', 0),
(86, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:21:26', 0),
(87, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:21:30', 0),
(88, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 12:22:24', 0),
(89, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:22:26', 0),
(90, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:22:27', 0),
(91, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 12:24:16', 0),
(92, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:24:16', 0),
(93, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:24:17', 0),
(94, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 12:25:03', 0),
(95, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:25:04', 0),
(96, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:25:06', 0),
(97, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 12:26:49', 0),
(98, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:26:50', 0),
(99, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:26:54', 0),
(100, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:37:02', 0),
(101, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:37:40', 0),
(102, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:37:40', 0),
(103, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 12:43:30', 0),
(104, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 14:01:17', 0),
(105, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 14:06:32', 0),
(106, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 14:06:45', 0),
(107, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 14:58:49', 0),
(108, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 15:02:58', 0),
(109, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 15:03:00', 0),
(110, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 15:03:33', 0),
(111, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 15:07:14', 0),
(112, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 15:10:05', 0),
(113, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 15:10:06', 0),
(114, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 15:13:27', 0),
(115, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 15:13:27', 0),
(116, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 15:13:28', 0),
(117, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 15:19:43', 0),
(118, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:01:53', 0),
(119, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:01:53', 0),
(120, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:01:53', 0),
(121, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:01:53', 0),
(122, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:01:53', 0),
(123, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:01:53', 0),
(124, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:02:21', 0),
(125, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:02:21', 0),
(126, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:02:21', 0),
(127, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:02:21', 0),
(128, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:02:21', 0),
(129, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-02-24 16:02:21', 0),
(130, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 16:04:11', 0),
(131, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 16:04:11', 0),
(132, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 16:04:11', 0),
(133, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 16:04:11', 0),
(134, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 16:04:11', 0),
(135, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-02-24 16:04:11', 0),
(136, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 12:43:22', 0),
(137, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 12:43:23', 0),
(138, 6, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 12:43:24', 0),
(139, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 12:44:12', 0),
(140, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 12:44:13', 0),
(141, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 12:44:14', 0),
(142, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 13:06:50', 0),
(143, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:06:53', 0),
(144, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:06:55', 0),
(145, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 13:08:29', 0),
(146, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 13:10:26', 0),
(147, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:13:36', 0),
(148, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:14:27', 0),
(149, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:16:39', 0),
(150, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:16:39', 0),
(151, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:16:40', 0),
(152, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:18:23', 0),
(153, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:18:36', 0),
(154, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:18:50', 0),
(155, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:18:50', 0),
(156, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:41:48', 0),
(157, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:41:49', 0),
(158, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 13:41:50', 0),
(159, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:32:20', 0),
(160, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 14:33:05', 0),
(161, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:33:27', 0),
(162, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:33:59', 0),
(163, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:34:26', 0),
(164, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:35:22', 0),
(165, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:36:21', 0),
(166, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:36:34', 0),
(167, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:36:43', 0),
(168, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:39:10', 0),
(169, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:44:54', 0),
(170, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:45:10', 0),
(171, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:45:10', 0),
(172, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:45:11', 0),
(173, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 14:53:18', 0),
(174, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:53:20', 0),
(175, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:53:21', 0),
(176, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 14:55:04', 0),
(177, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:55:05', 0),
(178, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:55:07', 0),
(179, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:55:24', 0),
(180, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:55:26', 0),
(181, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:55:27', 0),
(182, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:55:28', 0),
(183, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:55:29', 0),
(184, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:20', 0),
(185, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 14:59:20', 0),
(186, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:20', 0),
(187, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 14:59:20', 0),
(188, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:22', 0),
(189, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:22', 0),
(190, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:22', 0),
(191, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:22', 0),
(192, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:35', 0),
(193, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:35', 0),
(194, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:35', 0),
(195, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:35', 0),
(196, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:49', 0),
(197, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:49', 0),
(198, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:49', 0),
(199, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:49', 0),
(200, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:52', 0),
(201, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:52', 0),
(202, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 14:59:53', 0),
(203, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:11:19', 0),
(204, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:11:19', 0),
(205, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 15:11:19', 0),
(206, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:11:21', 0),
(207, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:11:21', 0),
(208, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:11:21', 0),
(209, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:11:38', 0),
(210, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:11:38', 0),
(211, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:11:38', 0),
(212, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-03 15:13:05', 0),
(213, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:43:25', 0),
(214, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:43:25', 0),
(215, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-03 15:43:26', 0),
(216, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-04 12:36:54', 0),
(217, 7, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-04 13:07:52', 0),
(218, 7, 'Vos permissions pour une declaration ont été mises à jour.', '2025-03-04 14:28:28', 0),
(219, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-10 14:14:23', 0),
(220, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:14:25', 0),
(221, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:14:26', 0),
(222, 3, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:22:41', 0),
(223, 3, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:22:41', 0),
(224, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-10 14:23:57', 0),
(225, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:23:58', 0),
(226, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:23:59', 0),
(227, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:24:12', 0),
(228, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:35:10', 0),
(229, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:37:36', 0),
(230, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:41:29', 0),
(231, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-10 14:41:58', 0),
(232, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:42:00', 0),
(233, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:42:01', 0),
(234, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:42:02', 0),
(235, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-10 14:42:08', 0),
(236, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:42:09', 0),
(237, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:42:10', 0),
(238, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-10 14:43:13', 0),
(239, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:43:14', 0),
(240, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:43:15', 0),
(241, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-10 14:45:46', 0),
(242, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:45:47', 0),
(243, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:45:48', 0),
(244, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-10 14:46:39', 0),
(245, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-10 14:51:53', 0),
(246, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:51:54', 0),
(247, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:51:55', 0),
(248, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:53:22', 0),
(249, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:53:46', 0),
(250, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-10 14:57:00', 0),
(251, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:57:00', 0),
(252, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:57:01', 0),
(253, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-10 14:57:48', 0),
(254, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-12 14:31:43', 0),
(255, 6, 'Vous avez reçu un accès à une nouvelle tâche.', '2025-03-12 14:40:30', 0),
(256, 6, 'Vos permissions pour une tâche ont été mises à jour.', '2025-03-12 14:49:53', 0);

-- --------------------------------------------------------

--
-- Structure de la table `objet_fact`
--

CREATE TABLE `objet_fact` (
  `id_objet_fact` int(11) NOT NULL,
  `nom_objet_fact` varchar(255) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `objet_fact`
--

INSERT INTO `objet_fact` (`id_objet_fact`, `nom_objet_fact`, `date_creation`) VALUES
(1, 'Superficie', '2024-11-04 08:45:02'),
(2, 'Manutention contract', '2024-11-04 08:45:02'),
(3, 'Manutention add', '2024-11-04 08:45:02'),
(4, 'Autres manut', '2024-11-04 08:45:02');

-- --------------------------------------------------------

--
-- Structure de la table `offres`
--

CREATE TABLE `offres` (
  `id_offre` int(11) NOT NULL,
  `id_fournisseur` int(11) DEFAULT NULL,
  `id_projet` int(11) DEFAULT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `nom_offre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `id_cat_tache` int(11) DEFAULT NULL,
  `date_creation` datetime DEFAULT current_timestamp(),
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offres`
--

INSERT INTO `offres` (`id_offre`, `id_fournisseur`, `id_projet`, `id_batiment`, `nom_offre`, `description`, `id_cat_tache`, `date_creation`, `est_supprime`) VALUES
(1, 1, 1, 1, 'Offre 1', 'adddddddddddddddddddd', NULL, '2024-09-07 13:58:19', 0),
(2, 2, NULL, 1, 'Offre 2', 'DDDDDDDDDDDD', NULL, '2024-09-07 13:58:56', 0),
(3, 1, 2, 1, 'Offre 11', 'AAAAAAAAAAAAAAAAAA', NULL, '2024-09-07 17:16:29', 0),
(4, 2, 2, 1, 'Offre 23', 'AAAAAAAAAAA', NULL, '2024-09-07 17:17:13', 0),
(5, 1, NULL, 1, 'Chaise', 'sssssssssssssss', 1, '2024-10-02 10:13:39', 0),
(6, 2, NULL, 7, 'Offre 33', 'dddddddd', 2, '2024-10-17 10:04:00', 0),
(7, 1, NULL, 1, 'Offre d\'achat des element d\'entrepot', 'ddddd', 12, '2024-10-17 10:18:04', 0),
(8, 2, NULL, 3, 'Offre d\'achat des element d\'entrepot', NULL, 5, '2024-10-17 10:20:18', 0);

-- --------------------------------------------------------

--
-- Structure de la table `offre_article`
--

CREATE TABLE `offre_article` (
  `id_offre_article` int(11) NOT NULL,
  `id_offre` int(11) DEFAULT NULL,
  `id_article` int(11) DEFAULT NULL,
  `prix` int(11) NOT NULL,
  `quantite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offre_article`
--

INSERT INTO `offre_article` (`id_offre_article`, `id_offre`, `id_article`, `prix`, `quantite`) VALUES
(8, 7, 4, 10, 2),
(9, 7, 26, 10, 10),
(10, 8, 4, 8, 2),
(11, 8, 26, 9, 5);

-- --------------------------------------------------------

--
-- Structure de la table `pays`
--

CREATE TABLE `pays` (
  `id_pays` int(11) NOT NULL,
  `nom_pays` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `pays`
--

INSERT INTO `pays` (`id_pays`, `nom_pays`) VALUES
(1, 'RDC');

-- --------------------------------------------------------

--
-- Structure de la table `permission`
--

CREATE TABLE `permission` (
  `id_permission` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `menus_id` int(11) NOT NULL,
  `submenu_id` int(11) DEFAULT NULL,
  `can_read` tinyint(1) NOT NULL DEFAULT 0,
  `can_edit` tinyint(1) NOT NULL DEFAULT 0,
  `can_comment` tinyint(4) NOT NULL DEFAULT 0,
  `can_delete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `permission`
--

INSERT INTO `permission` (`id_permission`, `user_id`, `menus_id`, `submenu_id`, `can_read`, `can_edit`, `can_comment`, `can_delete`) VALUES
(96, 3, 2, 0, 1, 1, 1, 1),
(97, 3, 11, 0, 1, 1, 1, 1),
(98, 3, 11, 12, 1, 1, 1, 1),
(99, 3, 11, 13, 1, 1, 1, 1),
(100, 3, 11, 14, 1, 1, 1, 1),
(101, 3, 11, 15, 1, 1, 1, 1),
(102, 3, 11, 16, 1, 1, 1, 1),
(103, 3, 11, 17, 1, 1, 1, 1),
(104, 3, 11, 18, 1, 1, 1, 1),
(105, 3, 11, 19, 1, 1, 1, 1),
(106, 3, 11, 20, 1, 1, 1, 1),
(107, 3, 11, 22, 1, 1, 1, 1),
(108, 3, 11, 34, 1, 1, 1, 1),
(109, 3, 11, 35, 1, 1, 1, 1),
(110, 3, 12, 0, 1, 1, 1, 1),
(111, 3, 12, 23, 1, 1, 1, 1),
(112, 3, 12, 24, 1, 1, 1, 1),
(113, 3, 12, 25, 1, 1, 1, 1),
(114, 3, 12, 26, 1, 1, 1, 1),
(115, 3, 10, 0, 1, 1, 1, 1),
(116, 3, 9, 0, 1, 1, 1, 1),
(117, 3, 8, 0, 1, 1, 1, 1),
(118, 3, 7, 0, 1, 1, 1, 1),
(119, 3, 6, 0, 1, 1, 1, 1),
(120, 3, 7, 11, 1, 1, 1, 1),
(121, 3, 7, 21, 1, 1, 1, 1),
(122, 3, 6, 9, 1, 1, 1, 1),
(123, 3, 6, 10, 1, 1, 1, 1),
(124, 3, 6, 31, 1, 1, 1, 1),
(125, 3, 3, 0, 1, 1, 1, 1),
(126, 3, 4, 0, 1, 1, 1, 1),
(127, 3, 4, 1, 1, 1, 1, 1),
(128, 3, 4, 2, 1, 1, 1, 1),
(129, 3, 4, 3, 1, 1, 1, 1),
(130, 3, 5, 0, 1, 1, 1, 1),
(131, 6, 6, 0, 1, 1, 1, 1),
(132, 6, 6, 9, 1, 0, 0, 0),
(133, 6, 6, 10, 1, 0, 0, 0),
(134, 12, 6, 0, 1, 1, 0, 0),
(135, 12, 6, 9, 1, 0, 0, 0),
(136, 12, 6, 10, 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `permissions_declaration`
--

CREATE TABLE `permissions_declaration` (
  `id_permissions_declaration` int(11) NOT NULL,
  `id_template` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL,
  `id_ville` int(11) DEFAULT NULL,
  `can_view` tinyint(4) DEFAULT 0,
  `can_edit` tinyint(4) DEFAULT 0,
  `can_comment` tinyint(4) DEFAULT 0,
  `can_delete` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `permissions_declaration`
--

INSERT INTO `permissions_declaration` (`id_permissions_declaration`, `id_template`, `id_user`, `id_client`, `id_ville`, `can_view`, `can_edit`, `can_comment`, `can_delete`) VALUES
(37, 8, 7, NULL, 1, 0, 0, 0, 0),
(38, 11, 7, 1, NULL, 1, 1, 1, 1),
(39, 2, 7, 1, NULL, 0, 0, 0, 0),
(40, 9, 7, 1, NULL, 0, 0, 0, 0),
(41, 10, 7, NULL, 1, 1, 0, 0, 0),
(42, 10, 6, NULL, 1, 1, 0, 0, 0),
(43, 3, 7, 2, NULL, 0, 0, 0, 1);

-- --------------------------------------------------------

--
-- Structure de la table `permissions_tache`
--

CREATE TABLE `permissions_tache` (
  `id_permissions_tache` int(11) NOT NULL,
  `id_tache` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_ville` int(11) DEFAULT NULL,
  `id_departement` int(11) DEFAULT NULL,
  `can_view` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0,
  `can_comment` tinyint(1) DEFAULT 0,
  `can_delete` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `permissions_tache`
--

INSERT INTO `permissions_tache` (`id_permissions_tache`, `id_tache`, `id_user`, `id_ville`, `id_departement`, `can_view`, `can_edit`, `can_comment`, `can_delete`) VALUES
(45, 26, 3, NULL, NULL, 1, 1, 1, 0),
(46, 26, 7, NULL, NULL, 0, 0, 0, 0),
(47, 25, 7, NULL, NULL, 1, 1, 1, 0),
(48, 11, 7, NULL, NULL, 1, 0, 0, 0),
(49, 24, 7, NULL, NULL, 0, 0, 0, 0),
(50, 33, 12, NULL, NULL, 1, 1, 1, 0),
(51, 35, 3, NULL, NULL, 1, 1, 1, 0),
(52, 36, 3, NULL, NULL, 1, 1, 1, 0),
(53, 37, 3, NULL, NULL, 1, 1, 1, 0),
(54, 38, 3, NULL, NULL, 1, 1, 1, 0),
(55, 39, 3, NULL, NULL, 1, 1, 1, 0),
(56, 40, 3, NULL, NULL, 1, 1, 1, 0),
(57, 41, 3, NULL, NULL, 1, 0, 1, 0),
(58, 42, 3, NULL, NULL, 1, 1, 1, 0),
(59, 43, 3, NULL, NULL, 1, 1, 1, 0),
(60, 44, 12, NULL, NULL, 1, 1, 1, 0),
(61, 45, 3, NULL, NULL, 1, 1, 1, 0),
(62, 46, 12, NULL, NULL, 1, 1, 1, 0),
(63, 47, 12, NULL, NULL, 1, 1, 1, 0),
(64, 48, 12, NULL, NULL, 1, 1, 1, 0),
(65, 49, 12, NULL, NULL, 1, 1, 1, 0),
(66, 50, 12, NULL, NULL, 1, 1, 1, 0),
(67, 51, 12, NULL, NULL, 1, 1, 1, 0),
(68, 52, 12, NULL, NULL, 1, 1, 1, 0),
(69, 53, 12, NULL, NULL, 1, 1, 1, 0),
(70, 54, 3, NULL, NULL, 1, 1, 1, 0),
(71, 55, 3, NULL, NULL, 1, 1, 1, 0),
(72, 56, 3, NULL, NULL, 1, 1, 1, 0),
(73, 57, 3, NULL, NULL, 1, 1, 1, 0),
(74, 58, 3, NULL, NULL, 1, 1, 1, 0),
(75, 59, 12, NULL, NULL, 1, 1, 1, 0),
(76, 60, 12, NULL, NULL, 1, 1, 1, 0),
(77, 61, 3, NULL, NULL, 1, 1, 1, 0),
(78, 62, 12, NULL, NULL, 1, 1, 1, 0),
(79, 63, 12, NULL, NULL, 1, 1, 1, 0),
(80, 2, 12, NULL, NULL, 1, 1, 1, 0),
(81, 21, 12, NULL, NULL, 1, 1, 1, 0),
(82, 4, 12, NULL, NULL, 1, 1, 1, 0),
(83, 3, 12, NULL, NULL, 1, 1, 1, 0),
(84, 56, 12, NULL, NULL, 1, 1, 1, 0),
(85, 61, 12, NULL, NULL, 1, 1, 1, 0),
(86, 64, 3, NULL, NULL, 1, 1, 1, 0),
(87, 65, 3, NULL, NULL, 1, 1, 1, 0),
(88, 66, 3, NULL, NULL, 1, 1, 1, 0),
(89, 67, 12, NULL, NULL, 1, 1, 1, 0),
(90, 68, 3, NULL, NULL, 1, 1, 1, 0),
(91, 69, 3, NULL, NULL, 1, 1, 1, 0),
(92, 70, 3, NULL, NULL, 1, 1, 1, 0),
(93, 71, 3, NULL, NULL, 1, 1, 1, 0),
(102, 41, 6, 1, NULL, 1, 1, 1, 1),
(103, 10, 6, NULL, 5, 1, 1, 0, 0),
(104, 4, 6, NULL, 6, 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `points_de_supervision`
--

CREATE TABLE `points_de_supervision` (
  `id_point` int(11) NOT NULL,
  `nom_point` int(200) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `priorite`
--

CREATE TABLE `priorite` (
  `id_priorite` int(11) NOT NULL,
  `nom_priorite` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `priorite`
--

INSERT INTO `priorite` (`id_priorite`, `nom_priorite`, `created_at`) VALUES
(1, 'Très faible', '2024-09-16 10:13:18'),
(2, 'Faible', '2024-09-16 10:13:18'),
(3, 'Moyenne', '2024-09-16 10:13:18'),
(4, 'Haute', '2024-09-16 10:13:18'),
(5, 'Très haute', '2024-09-16 10:13:18');

-- --------------------------------------------------------

--
-- Structure de la table `projet`
--

CREATE TABLE `projet` (
  `id_projet` int(11) NOT NULL,
  `nom_projet` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `chef_projet` int(11) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `statut` int(11) DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `client` int(11) DEFAULT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_cr` int(11) DEFAULT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `projet`
--

INSERT INTO `projet` (`id_projet`, `nom_projet`, `description`, `chef_projet`, `date_debut`, `date_fin`, `statut`, `budget`, `client`, `id_batiment`, `date_creation`, `date_modification`, `user_cr`, `est_supprime`) VALUES
(16, 'Projet 6', NULL, 6, '2024-09-08', '2024-09-27', 1, 100.00, 5, 7, '2024-09-11 15:54:41', '2024-10-03 15:32:06', NULL, 0),
(17, 'Projet 1', NULL, 7, '2024-09-12', '2024-09-29', 1, 0.00, NULL, NULL, '2024-09-13 12:58:23', '2024-09-13 12:58:23', NULL, 0),
(18, 'Projet 9', NULL, 7, '2024-09-12', '2024-09-29', 1, 0.00, NULL, NULL, '2024-09-13 12:59:52', '2024-09-13 12:59:52', NULL, 0),
(19, 'Projet 2', NULL, 7, '2024-09-12', '2024-09-29', 1, 0.00, NULL, NULL, '2024-09-13 13:03:33', '2024-09-13 13:03:33', NULL, 0),
(20, 'Projet 101', NULL, 9, '2024-09-12', '2024-09-29', 1, 0.00, NULL, NULL, '2024-09-13 13:04:07', '2024-09-13 13:04:07', NULL, 0),
(21, 'Projet 1', 'AAAAAAAAAAAAAA', 6, '2024-10-02', '2024-10-29', 1, 0.00, NULL, NULL, '2024-10-03 15:38:14', '2024-10-03 15:38:14', NULL, 0),
(22, 'Projet 188', NULL, 6, '2024-10-02', '2024-10-20', 1, 0.00, NULL, NULL, '2024-10-03 16:05:53', '2024-10-03 16:05:53', NULL, 0),
(23, 'Projet 1555', 'EEEEEE', 6, '2024-10-02', '2024-09-30', 1, 0.00, NULL, NULL, '2024-10-03 16:07:06', '2024-10-03 16:07:06', NULL, 0),
(24, 'Projet A1', '<p>dcddddddddddddddddddddd</p>', 3, '2024-10-08', '2024-10-30', 1, 0.00, NULL, NULL, '2024-10-09 15:33:48', '2024-10-09 15:33:48', NULL, 0),
(25, 'Projet 22', '<p>dddddddddddd</p>', 6, '2024-10-07', '2024-10-28', 1, 0.00, NULL, NULL, '2024-10-10 11:18:09', '2024-10-10 13:17:16', NULL, 0),
(26, 'Projet 144', '<p>QQQQQQSSSSSSSSSSSSSSSS</p>', 6, '2024-10-13', '2024-10-30', 1, 0.00, NULL, NULL, '2024-10-14 13:53:59', '2024-10-14 13:53:59', NULL, 0),
(27, 'Projet 3', '<p>CCCCCCDDDDDD</p>', 8, '2024-10-15', '2024-10-15', 1, 0.00, NULL, NULL, '2024-10-16 13:41:28', '2024-10-16 13:41:28', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `projet_batiment`
--

CREATE TABLE `projet_batiment` (
  `id_projet_entite` int(11) NOT NULL,
  `id_projet` int(11) NOT NULL,
  `id_batiment` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_MisAjour` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `projet_batiment`
--

INSERT INTO `projet_batiment` (`id_projet_entite`, `id_projet`, `id_batiment`, `created_at`, `date_MisAjour`) VALUES
(3, 16, 1, '2024-09-11 15:54:41', '2024-09-11 15:54:41'),
(4, 17, 1, '2024-09-13 12:58:24', '2024-09-13 12:58:24'),
(5, 18, 1, '2024-09-13 12:59:52', '2024-09-13 12:59:52'),
(6, 19, 1, '2024-09-13 13:03:33', '2024-09-13 13:03:33'),
(7, 20, 1, '2024-09-13 13:04:07', '2024-09-13 13:04:07'),
(8, 21, 8, '2024-10-03 15:38:14', '2024-10-03 15:38:14'),
(9, 23, 3, '2024-10-03 16:07:06', '2024-10-03 16:07:06'),
(10, 24, 1, '2024-10-09 15:33:48', '2024-10-09 15:33:48'),
(11, 25, 6, '2024-10-10 11:18:09', '2024-10-10 11:18:09'),
(12, 26, 8, '2024-10-14 13:53:59', '2024-10-14 13:53:59');

-- --------------------------------------------------------

--
-- Structure de la table `projet_client`
--

CREATE TABLE `projet_client` (
  `id_projet_client` int(11) NOT NULL,
  `id_projet` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `projet_client`
--

INSERT INTO `projet_client` (`id_projet_client`, `id_projet`, `id_client`, `created_at`) VALUES
(4, 16, 1, '2024-09-11 15:54:41'),
(5, 16, 2, '2024-09-11 15:54:41'),
(6, 16, 3, '2024-09-11 15:54:41'),
(7, 17, 1, '2024-09-13 12:58:24'),
(8, 18, 3, '2024-09-13 12:59:52'),
(9, 19, 1, '2024-09-13 13:03:33'),
(10, 20, 2, '2024-09-13 13:04:07'),
(11, 21, 8, '2024-10-03 15:38:14'),
(12, 23, 7, '2024-10-03 16:07:06'),
(13, 26, 6, '2024-10-14 13:53:59');

-- --------------------------------------------------------

--
-- Structure de la table `projet_suivi`
--

CREATE TABLE `projet_suivi` (
  `id_projet_suivi` int(11) NOT NULL,
  `id_projet` int(11) NOT NULL,
  `date_suivi` date NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `statut` int(11) DEFAULT NULL,
  `commentaires` text DEFAULT NULL,
  `pourcentage_completion` int(11) DEFAULT NULL CHECK (`pourcentage_completion` between 0 and 100),
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `projet_suivi_images`
--

CREATE TABLE `projet_suivi_images` (
  `id_image` int(11) NOT NULL,
  `id_projet_suivi` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `projet_tag`
--

CREATE TABLE `projet_tag` (
  `id_projet` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `provinces`
--

CREATE TABLE `provinces` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `capital` varchar(255) NOT NULL,
  `code_ville` varchar(20) DEFAULT NULL,
  `id_pays` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `provinces`
--

INSERT INTO `provinces` (`id`, `name`, `capital`, `code_ville`, `id_pays`) VALUES
(1, 'Kinshasa', 'Kinshasa', 'FIH', 1),
(2, 'Kongo-Central', 'Matadi', 'MAT', 1),
(3, 'Kwango', 'Kenge', NULL, 1),
(4, 'Kwilu', 'Bandundu', NULL, 1),
(5, 'Mai-Ndombe', 'Inongo', NULL, 1),
(6, 'Équateur', 'Mbandaka', NULL, 1),
(7, 'Mongala', 'Lisala', NULL, 1),
(8, 'Nord-Ubangi', 'Gbadolite', NULL, 1),
(9, 'Sud-Ubangi', 'Gemena', NULL, 1),
(10, 'Tshuapa', 'Boende', NULL, 1),
(11, 'Nord-Kivu', 'Goma', 'GOM', 1),
(12, 'Sud-Kivu', 'Bukavu', NULL, 1),
(13, 'Maniema', 'Kindu', NULL, 1),
(14, 'Haut-Lomami', 'Kamina', NULL, 1),
(15, 'Haut-Katanga', 'Lubumbashi', NULL, 1),
(16, 'Lualaba', 'Kolwezi', NULL, 1),
(17, 'Kasai', 'Luebo', NULL, 1),
(18, 'Kasai-Central', 'Kananga', NULL, 1),
(19, 'Kasai-Oriental', 'Mbuji-Mayi', NULL, 1),
(20, 'Lomami', 'Kabinda', NULL, 1),
(21, 'Sankuru', 'Lusambo', NULL, 1),
(22, 'Tanganyika', 'Kalemie', NULL, 1),
(23, 'Haut-Uele', 'Isiro', NULL, 1),
(24, 'Tshopo', 'Kisangani', NULL, 1),
(25, 'Bas-Uele', 'Buta', NULL, 1),
(26, 'Ituri', 'Bunia', NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `status_batiment`
--

CREATE TABLE `status_batiment` (
  `id_status_batiment` int(11) NOT NULL,
  `nom_status_batiment` varchar(255) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `status_batiment`
--

INSERT INTO `status_batiment` (`id_status_batiment`, `nom_status_batiment`, `date_creation`, `date_modification`) VALUES
(1, 'Couvert', '2025-01-22 12:21:26', '2025-01-22 12:41:29'),
(2, 'Non couvert', '2025-01-22 12:21:26', '2025-01-22 12:41:29');

-- --------------------------------------------------------

--
-- Structure de la table `statut_bins`
--

CREATE TABLE `statut_bins` (
  `id_statut_bins` int(11) NOT NULL,
  `nom_statut_bins` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `statut_bins`
--

INSERT INTO `statut_bins` (`id_statut_bins`, `nom_statut_bins`) VALUES
(1, 'Occupé'),
(2, 'Libre');

-- --------------------------------------------------------

--
-- Structure de la table `statut_declaration`
--

CREATE TABLE `statut_declaration` (
  `id_statut_declaration` int(11) NOT NULL,
  `nom_statut_decl` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `statut_declaration`
--

INSERT INTO `statut_declaration` (`id_statut_declaration`, `nom_statut_decl`) VALUES
(1, 'Ouvert'),
(2, 'Clôturé');

-- --------------------------------------------------------

--
-- Structure de la table `statut_equipement`
--

CREATE TABLE `statut_equipement` (
  `id_statut_equipement` int(11) NOT NULL,
  `nom_statut` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `statut_equipement`
--

INSERT INTO `statut_equipement` (`id_statut_equipement`, `nom_statut`) VALUES
(1, 'Opérationnel'),
(2, 'En entretien'),
(3, 'En panne');

-- --------------------------------------------------------

--
-- Structure de la table `statut_maintenance`
--

CREATE TABLE `statut_maintenance` (
  `id_statut_maintenance` int(11) NOT NULL,
  `nom_statut_maintenance` varchar(200) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `statut_maintenance`
--

INSERT INTO `statut_maintenance` (`id_statut_maintenance`, `nom_statut_maintenance`, `date_creation`, `date_modification`) VALUES
(1, 'Planifie', '2024-09-23 11:06:13', '2024-09-23 11:06:13'),
(2, 'En cours', '2024-09-23 11:06:13', '2024-09-23 11:06:13'),
(3, 'Termine', '2024-09-23 11:06:13', '2024-09-23 11:06:13'),
(4, 'Problème', '2024-09-23 11:06:13', '2024-09-23 11:06:13');

-- --------------------------------------------------------

--
-- Structure de la table `statut_template`
--

CREATE TABLE `statut_template` (
  `id_statut_template` int(11) NOT NULL,
  `nom_statut_template` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `statut_template`
--

INSERT INTO `statut_template` (`id_statut_template`, `nom_statut_template`) VALUES
(1, 'Activé'),
(2, 'Désactivé');

-- --------------------------------------------------------

--
-- Structure de la table `stocks_equipements`
--

CREATE TABLE `stocks_equipements` (
  `id_stock` int(11) NOT NULL,
  `id_type_equipement` int(11) DEFAULT NULL,
  `quantite` int(11) DEFAULT 0,
  `seuil_alerte` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `submenus`
--

CREATE TABLE `submenus` (
  `id` int(11) NOT NULL,
  `menu_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `submenus`
--

INSERT INTO `submenus` (`id`, `menu_id`, `title`, `url`, `icon`) VALUES
(1, 4, 'Liste de bâtiment', '/batiment', NULL),
(2, 4, 'Liste des bins', '/liste_bins', NULL),
(3, 4, 'Liste d\'équipements', '/liste_equipement', NULL),
(5, 5, 'Liste des projets', '/projet', NULL),
(6, 5, 'Liste des offres', '/offre', NULL),
(7, 5, 'Budget', '/budget', NULL),
(8, 5, 'Liste des besoins', '/besoins', NULL),
(9, 6, 'Liste des taches', '/tache', NULL),
(10, 6, 'Liste des tracking', '/liste_tracking', NULL),
(11, 7, 'Liste des articles', '/article', NULL),
(12, 11, 'Liste des utilisateurs', '/utilisateur', NULL),
(13, 11, 'Liste des clients', '/client', NULL),
(14, 11, 'Liste des fournisseurs', '/fournisseur', NULL),
(15, 11, 'Liste de cat d\'article', '/categorie', NULL),
(16, 11, 'Liste de cat tache', '/liste_cat_tache', NULL),
(17, 11, 'Liste de corps métier', '/corpsMetier', NULL),
(18, 11, 'Liste des formats', '/format', NULL),
(19, 11, 'Liste des fréquences', '/frequence', NULL),
(20, 11, 'Permissions', '/permission', NULL),
(21, 7, 'Prix', '/prix', NULL),
(22, 11, 'Profile', '/profile', NULL),
(23, 12, 'Liste des templates', '/liste_template', NULL),
(24, 12, 'Créer un template', '/template_form', NULL),
(25, 12, 'Liste des déclarations', '/liste_declaration', NULL),
(26, 12, 'Créer une déclaration', '/declaration_form', NULL),
(31, 6, 'Créer une tâche', '/tache_form', NULL),
(34, 11, 'Liste de cat inspection', '/liste_cat_inspection', NULL),
(35, 11, 'AuditLogsTache', '/auditLogs', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `suivi_controle_de_base`
--

CREATE TABLE `suivi_controle_de_base` (
  `id_suivi_controle` int(11) NOT NULL,
  `id_controle` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `commentaires` text DEFAULT NULL,
  `date_suivi` timestamp NOT NULL DEFAULT current_timestamp(),
  `effectue_par` int(11) NOT NULL,
  `est_termine` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `suivi_offres`
--

CREATE TABLE `suivi_offres` (
  `id_suivi` int(11) NOT NULL,
  `id_offre` int(11) DEFAULT NULL,
  `date_suivi` datetime NOT NULL,
  `id_statut_suivi` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `suivi_tache`
--

CREATE TABLE `suivi_tache` (
  `id_suivi` int(11) NOT NULL,
  `id_tache` int(11) NOT NULL,
  `date_suivi` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL,
  `commentaire` text DEFAULT NULL,
  `pourcentage_avancement` decimal(5,2) NOT NULL DEFAULT 0.00,
  `effectue_par` int(11) DEFAULT NULL,
  `est_termine` tinyint(1) NOT NULL DEFAULT 0,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `suivi_tache`
--

INSERT INTO `suivi_tache` (`id_suivi`, `id_tache`, `date_suivi`, `status`, `commentaire`, `pourcentage_avancement`, `effectue_par`, `est_termine`, `est_supprime`) VALUES
(11, 3, '2024-09-10 09:07:39', 2, 'sssssssssssssssssssss', 100.00, 10, 0, 0),
(12, 3, '2024-09-10 09:09:11', 3, 'VVVVVVVVVVVVVVVVVV', 10.00, 10, 0, 0),
(13, 3, '2024-09-10 09:18:38', 1, 'ccccccccccddddddddddddddddddxxxxxxxxxxxxxxddddddd', 50.00, 11, 0, 0),
(14, 3, '2024-09-10 09:21:49', 5, 'RRRRRRRRRRRRRRRR', 100.00, 8, 1, 0),
(15, 2, '2024-09-10 12:43:51', 2, 'aaaaaaaaaaaaaaaaaa', 40.00, 6, 0, 0),
(16, 3, '2024-09-10 12:48:18', 2, 'Seccccccccccccccceeeeeeeeeeee', 100.00, 8, 1, 0),
(17, 3, '2024-09-10 12:50:31', 2, 'Seccccccccccccccceeeeeeeeeeee', 100.00, 8, 1, 0),
(18, 3, '2024-09-10 12:51:22', 5, 'aaaaaaaaaa', 100.00, 6, 1, 0),
(19, 2, '2024-09-10 12:53:35', 3, 'eddddddddddddddddddd', 50.00, 6, 0, 0),
(20, 2, '2024-09-10 12:55:30', 5, 'dddddddddddddddddds', 100.00, 6, 0, 0),
(21, 2, '2024-09-10 12:56:50', 6, 'CCCCCCCVVVVVV', 100.00, 8, 1, 0),
(22, 2, '2024-09-10 12:58:25', 7, 'SSSSSSSSSSSSSSSS', 100.00, 7, 1, 0),
(23, 2, '2024-09-10 13:00:32', 5, 'ccccvvvvvvvvvvvv', 100.00, 9, 1, 0),
(24, 3, '2024-09-10 13:01:30', 6, 'SSSSSSSSSCCCCCCC', 50.00, 9, 1, 0),
(25, 11, '2024-09-18 09:12:04', 2, 'aaaaaaaaaaaaaaaa', 50.00, 7, 0, 0),
(26, 11, '2024-09-18 09:54:54', 4, 'cccccccvvvvvvvvvvvv', 90.00, 7, 0, 0),
(27, 14, '2024-09-18 11:47:59', 2, 'aaaaaaaaaaaaaaaaGGG', 80.00, 7, 0, 0),
(28, 4, '2024-09-25 11:10:33', 3, 'sssssssssss', 50.00, 6, 0, 0),
(29, 25, '2024-10-31 07:14:25', 2, 'eeeeeeeeeeeeee', 10.00, 6, 0, 0),
(30, 25, '2024-10-31 08:48:27', 2, 'rrrrrrrrrrrrrr', 10.00, 3, 0, 0),
(31, 25, '2024-10-31 08:48:53', 2, 'fffffffffffffffffff', 10.00, 7, 0, 0),
(32, 25, '2024-10-31 08:53:59', 2, 'ddssssssssssssss', 10.00, 6, 1, 0),
(33, 25, '2024-10-31 08:54:26', 2, 'ddssvvvvvvvvvvvvvv', 10.00, 6, 1, 0),
(34, 25, '2024-10-31 08:54:38', 2, 'ddszzzzzzzzzzzzzzzzzzzzzz', 10.00, 6, 1, 0),
(35, 66, '2024-11-28 14:20:56', 2, 'ccccccccccccccccccc', 10.00, 6, 0, 0),
(36, 67, '2024-11-28 14:29:13', 2, 'VDDDDDDDDDD', 10.00, 12, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `tache`
--

CREATE TABLE `tache` (
  `id_tache` int(11) NOT NULL,
  `nom_tache` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `statut` int(11) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `priorite` int(11) DEFAULT 3,
  `id_tache_parente` int(11) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL,
  `id_departement` int(11) DEFAULT NULL,
  `id_frequence` int(11) DEFAULT NULL,
  `id_control` int(11) DEFAULT NULL,
  `id_projet` int(11) DEFAULT NULL,
  `id_point_supervision` int(11) DEFAULT NULL,
  `responsable_principal` int(11) DEFAULT NULL,
  `id_demandeur` int(11) DEFAULT NULL,
  `id_batiment` int(11) DEFAULT NULL,
  `id_ville` int(11) DEFAULT NULL,
  `id_cat_tache` int(11) DEFAULT NULL,
  `id_corps_metier` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `doc` longtext DEFAULT NULL,
  `user_cr` int(11) DEFAULT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tache`
--

INSERT INTO `tache` (`id_tache`, `nom_tache`, `description`, `statut`, `date_debut`, `date_fin`, `priorite`, `id_tache_parente`, `id_client`, `id_departement`, `id_frequence`, `id_control`, `id_projet`, `id_point_supervision`, `responsable_principal`, `id_demandeur`, `id_batiment`, `id_ville`, `id_cat_tache`, `id_corps_metier`, `date_creation`, `date_modification`, `doc`, `user_cr`, `est_supprime`) VALUES
(2, 'Tache', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 1, '2024-08-29', '2024-09-27', 3, NULL, 2, 7, 5, 10, NULL, NULL, 7, NULL, 1, 1, NULL, NULL, '2024-09-10 08:54:57', '2024-09-17 11:05:19', NULL, NULL, 0),
(3, 'Tache 10', 'aaaaaaaaddddddddddddddd', 6, '2024-08-31', '2024-09-29', 3, NULL, 3, 6, 3, 12, NULL, NULL, 9, NULL, NULL, 3, NULL, NULL, '2024-09-10 08:58:50', '2024-09-17 11:05:19', NULL, NULL, 0),
(4, 'Tache40', 'AAAAAAAAAAAA', 3, '2024-09-09', '2024-09-29', 2, NULL, 4, 6, 1, NULL, NULL, NULL, 7, 7, 1, 4, NULL, NULL, '2024-09-10 13:18:16', '2024-09-25 11:10:33', NULL, NULL, 0),
(5, 'Tache 50', 'AAAAAAAA', 1, '2024-09-09', '2024-09-29', 3, NULL, 5, 7, 6, NULL, NULL, NULL, 11, 10, 1, 2, NULL, NULL, '2024-09-10 13:23:09', '2024-09-17 11:05:19', NULL, NULL, 0),
(6, 'Tache projet 10', 'aaaaaaaaaaaaaaaaaaa', 1, '2024-09-11', '2024-09-29', 3, NULL, 2, 7, 3, NULL, 16, NULL, 9, 9, 1, 2, NULL, NULL, '2024-09-12 07:06:02', '2024-09-17 11:05:19', NULL, NULL, 0),
(7, 'Projet tache 10', 'xcsddddddddddddddddd', 1, '2024-09-09', '2024-09-27', 2, NULL, 7, 7, 3, NULL, 16, NULL, 7, 7, 1, 2, NULL, NULL, '2024-09-12 07:08:22', '2024-09-17 11:54:05', NULL, NULL, 0),
(8, 'Projet 55', 'AAAAAAAAAAAAAAAAAAAA', 1, '2024-09-09', '2024-09-27', 3, NULL, 3, 7, 2, NULL, 16, NULL, 3, 6, 1, 2, NULL, NULL, '2024-09-12 07:09:23', '2024-09-17 11:53:39', NULL, NULL, 0),
(9, 'PROJET 100', 'cccccccccccccccccccddddddddddddddddddd', 1, '2024-09-09', '2024-09-27', 5, NULL, 2, 6, 1, NULL, 16, NULL, 7, 7, 1, 2, NULL, NULL, '2024-09-12 07:10:37', '2024-09-17 11:53:25', NULL, NULL, 0),
(10, 'Tache 01', 'ZSSSSSSSSSSSSSS', 1, '2024-09-09', '2024-09-27', 1, NULL, 1, 5, 4, NULL, NULL, NULL, 6, 10, 1, 4, NULL, NULL, '2024-09-12 10:24:22', '2024-09-17 10:32:50', NULL, NULL, 0),
(11, 'Projet 101', NULL, 4, '2024-09-09', '2024-10-04', 2, NULL, 2, 7, 4, NULL, 16, NULL, 6, 6, 1, 1, NULL, NULL, '2024-09-12 10:26:10', '2024-09-18 09:54:54', NULL, NULL, 0),
(12, 'Sous tache', 'aaaaaaaaa', 1, '2024-09-15', '2024-09-29', 4, 11, 2, 7, 7, NULL, NULL, NULL, 10, 11, 1, 3, NULL, NULL, '2024-09-16 13:38:38', '2024-09-18 10:26:05', NULL, NULL, 0),
(13, 'Sous Projet 101', 'AAAAAAAAAAAA', 1, '2024-09-15', '2024-09-29', 2, 11, 5, 6, 4, NULL, NULL, NULL, 9, 10, 1, 4, NULL, NULL, '2024-09-16 13:47:53', '2024-09-18 10:26:02', NULL, NULL, 0),
(14, 'Sous Projet 101', 'AAAAAAAAAAAA', 2, '2024-09-15', '2024-09-29', 1, 11, 5, 6, 4, NULL, NULL, NULL, 9, 10, 1, 4, NULL, NULL, '2024-09-16 13:49:01', '2024-09-18 11:47:59', NULL, NULL, 0),
(15, 'Tache controle', 'aaaaaaaaaaaaa', 1, '2024-09-19', '2024-09-29', 1, NULL, 1, 5, 4, 10, NULL, NULL, 6, NULL, 1, 1, NULL, NULL, '2024-09-20 09:32:22', '2024-09-20 09:32:22', NULL, NULL, 0),
(16, 'Tache controle 111', 'QQQQQQQQQ', 1, '2024-09-19', '2024-09-29', 1, NULL, 1, 5, 5, 12, NULL, NULL, 3, NULL, 1, 1, NULL, NULL, '2024-09-20 09:33:31', '2024-09-20 09:33:31', NULL, NULL, 0),
(18, 'Tache20', 'sssssssssssssssssssssss', 1, '2024-10-03', '2024-10-29', 3, NULL, 2, 6, 5, NULL, NULL, NULL, 7, 9, 4, 2, 5, 6, '2024-10-04 12:03:02', '2024-10-04 12:03:02', NULL, NULL, 0),
(19, 'Tache Tag 10', NULL, 1, '2024-10-03', '2024-10-28', 2, NULL, 4, 7, 5, NULL, NULL, NULL, 8, NULL, 4, 2, 7, 4, '2024-10-04 13:33:45', '2024-10-04 13:33:45', NULL, NULL, 0);
INSERT INTO `tache` (`id_tache`, `nom_tache`, `description`, `statut`, `date_debut`, `date_fin`, `priorite`, `id_tache_parente`, `id_client`, `id_departement`, `id_frequence`, `id_control`, `id_projet`, `id_point_supervision`, `responsable_principal`, `id_demandeur`, `id_batiment`, `id_ville`, `id_cat_tache`, `id_corps_metier`, `date_creation`, `date_modification`, `doc`, `user_cr`, `est_supprime`) VALUES
(20, 'Tache909', '<h1>Base de données dlog</h1><h2>Structure de la table besoins</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_besoin</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">description</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(200)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_creation</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">datetime</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_client</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr></tbody></table></div><h2>Déchargement des données de la table besoins</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table budgets</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_budget</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_tache</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">montant_total</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">decimal(10,0)</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">montant_utilisé</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">decimal(10,0)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"6\"><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_creation</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">datetime</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr></tbody></table></div><h2>Déchargement des données de la table budgets</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table client</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_client</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">nom</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">adresse</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">ville</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"6\"><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">pays</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"7\"><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">telephone</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(20)</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"8\"><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>email</strong></p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"9\"><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_creation</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr><tr data-row=\"10\"><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_modification</p></td><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr></tbody></table></div><h2>Déchargement des données de la table client</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table controles_de_base</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_controle</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">nom_controle</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(200)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Déchargement des données de la table controles_de_base</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table departement</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_departement</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">nom_departement</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">description</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">text</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>code</strong></p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(10)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"6\"><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">responsable</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"7\"><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">telephone</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(20)</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"8\"><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">email</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"9\"><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_creation</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">date</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"10\"><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_modification</p></td><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr></tbody></table></div><h2>Déchargement des données de la table departement</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table etat_offre</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_etat_offre</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">nom_etat_offre</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(200)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Déchargement des données de la table etat_offre</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">1</p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">En attente</p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">2</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">Acceptée</p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">3</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">Refusée</p></td></tr></tbody></table></div><h2>Structure de la table format</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_format</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">nom_format</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(100)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">description</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">text</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_user</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"6\"><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">created_at</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr><tr data-row=\"7\"><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">updated_at</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr></tbody></table></div><h2>Déchargement des données de la table format</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table frequence</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_frequence</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">nom</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">intervalle</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">unite</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">enum(&amp;#039;Jour&amp;#039;, &amp;#039;Semaine&amp;#039;, &amp;#039;Mois&amp;#039;, &amp;#039;Année&amp;#039;)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">Jour</p></td></tr><tr data-row=\"6\"><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_debut</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">date</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"7\"><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_fin</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">date</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"8\"><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_creation</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr><tr data-row=\"9\"><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_modification</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr></tbody></table></div><h2>Déchargement des données de la table frequence</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table items_budget</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_item</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_budget</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">description</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">qte_demande</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">decimal(10,0)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"6\"><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">qte_validee</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">decimal(10,0)</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"7\"><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_creation</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr></tbody></table></div><h2>Déchargement des données de la table items_budget</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table liens_taches_supervision</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_lien</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_tache</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_point_supervision</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_lien</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">datetime</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr></tbody></table></div><h2>Déchargement des données de la table liens_taches_supervision</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table offres</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_offre</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">description</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(255)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_creation</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">datetime</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_besoin</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"6\"><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_etat_offre</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr></tbody></table></div><h2>Déchargement des données de la table offres</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table points_de_supervision</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_point</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">nom_point</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(200)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_creation</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_modification</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">timestamp</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">current_timestamp()</p></td></tr></tbody></table></div><h2>Déchargement des données de la table points_de_supervision</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table suivi_offres</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_suivi</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_offre</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_suivi</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">datetime</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_statut_suivi</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr></tbody></table></div><h2>Déchargement des données de la table suivi_offres</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr></tbody></table></div><h2>Structure de la table tache</h2><div class=\"quill-better-table-wrapper\"><table class=\"quill-better-table\"><colgroup><col width=\"100\"><col width=\"100\"><col width=\"100\"><col width=\"100\"></colgroup><tbody><tr data-row=\"1\"><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line ql-align-center\" data-row=\"1\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Colonne</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Type</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Null</strong></p></td><td data-row=\"1\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"1\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><strong>Valeur par défaut</strong></p></td></tr><tr data-row=\"2\"><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\"><strong><em>id_tache</em></strong></p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"2\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"2\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"3\"><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">nom_tache</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">varchar(255)</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Non</p></td><td data-row=\"3\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"3\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\"><br></p></td></tr><tr data-row=\"4\"><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">description</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">text</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"4\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"4\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"5\"><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">statut</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"5\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"5\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"6\"><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_debut</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">date</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"6\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"6\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"7\"><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">date_fin</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">date</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"7\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"7\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"8\"><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">priorite</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">enum(&amp;#039;Basse&amp;#039;, &amp;#039;Moyenne&amp;#039;, &amp;#039;Haute&amp;#039;)</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"8\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"8\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">Moyenne</p></td></tr><tr data-row=\"9\"><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_tache_parente</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"9\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"9\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"10\"><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_frequence</p></td><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"10\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"10\" data-cell=\"4\" data-rowspan=\"1\" data-colspan=\"1\">NULL</p></td></tr><tr data-row=\"11\"><td data-row=\"11\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"11\" data-cell=\"1\" data-rowspan=\"1\" data-colspan=\"1\">id_point_supervision</p></td><td data-row=\"11\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"11\" data-cell=\"2\" data-rowspan=\"1\" data-colspan=\"1\">int(11)</p></td><td data-row=\"11\" rowspan=\"1\" colspan=\"1\"><p class=\"qlbt-cell-line\" data-row=\"11\" data-cell=\"3\" data-rowspan=\"1\" data-colspan=\"1\">Oui</p></td><td data-row=\"1', 1, '2024-10-07', '2024-10-30', 2, NULL, 2, 6, 7, NULL, NULL, NULL, 7, NULL, 1, 1, 7, 4, '2024-10-08 10:14:29', '2024-10-08 10:14:29', NULL, NULL, 0);
INSERT INTO `tache` (`id_tache`, `nom_tache`, `description`, `statut`, `date_debut`, `date_fin`, `priorite`, `id_tache_parente`, `id_client`, `id_departement`, `id_frequence`, `id_control`, `id_projet`, `id_point_supervision`, `responsable_principal`, `id_demandeur`, `id_batiment`, `id_ville`, `id_cat_tache`, `id_corps_metier`, `date_creation`, `date_modification`, `doc`, `user_cr`, `est_supprime`) VALUES
(21, 'Tache888', '<h1>Haute&nbsp;</h1>', 1, '2024-10-05', '2024-10-28', 3, NULL, 4, 6, 4, NULL, NULL, NULL, 8, 9, 7, 2, 7, 4, '2024-10-08 14:09:11', '2024-10-09 12:33:44', NULL, NULL, 0);
INSERT INTO `tache` (`id_tache`, `nom_tache`, `description`, `statut`, `date_debut`, `date_fin`, `priorite`, `id_tache_parente`, `id_client`, `id_departement`, `id_frequence`, `id_control`, `id_projet`, `id_point_supervision`, `responsable_principal`, `id_demandeur`, `id_batiment`, `id_ville`, `id_cat_tache`, `id_corps_metier`, `date_creation`, `date_modification`, `doc`, `user_cr`, `est_supprime`) VALUES
(22, 'T2024', '<h1><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Base de donn&eacute;es dlog</span></h1>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table besoins</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_besoin</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">description</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(200)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_creation</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">datetime</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_client</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table besoins</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table budgets</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_budget</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_tache</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">montant_total</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">decimal(10,0)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">montant_utilis&eacute;</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">decimal(10,0)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 5; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_creation</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">datetime</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table budgets</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table client</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_client</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">nom</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">adresse</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">ville</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 5;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">pays</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 6;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">telephone</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(20)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 7;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">email</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 8;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_creation</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 9; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_modification</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table client</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table controles_de_base</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_controle</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">nom_controle</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(200)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table controles_de_base</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table departement</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_departement</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">nom_departement</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">description</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">text</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">code</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(10)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 5;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">responsable</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 6;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">telephone</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(20)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 7;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">email</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 8;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_creation</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 9; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_modification</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table departement</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table etat_offre</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_etat_offre</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">nom_etat_offre</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(200)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table etat_offre</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">1</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">En attente</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">2</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Accept&eacute;e</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">3</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Refus&eacute;e</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table format</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_format</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">nom_format</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(100)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">description</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">text</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_user</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 5;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">created_at</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 6; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">updated_at</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table format</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table frequence</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_frequence</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">nom</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">intervalle</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">unite</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">enum(&amp;#039;Jour&amp;#039;, &amp;#039;Semaine&amp;#039;, &amp;#039;Mois&amp;#039;, &amp;#039;Ann&eacute;e&amp;#039;)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Jour</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 5;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_debut</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 6;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_fin</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 7;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_creation</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 8; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_modification</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table frequence</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table items_budget</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_item</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_budget</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">description</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">qte_demande</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">decimal(10,0)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 5;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">qte_validee</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">decimal(10,0)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 6; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_creation</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table items_budget</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table liens_taches_supervision</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_lien</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_tache</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_point_supervision</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_lien</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">datetime</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table liens_taches_supervision</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table offres</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_offre</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">description</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_creation</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">datetime</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_besoin</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 5; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_etat_offre</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table offres</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table points_de_supervision</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_point</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">nom_point</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(200)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_creation</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_modification</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">timestamp</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">current_timestamp()</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table points_de_supervision</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table suivi_offres</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_suivi</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_offre</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">date_suivi</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">datetime</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 4; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_statut_suivi</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Oui</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">NULL</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">D&eacute;chargement des donn&eacute;es de la table suivi_offres</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes; mso-yfti-lastrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<h2><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Structure de la table tache</span></h2>\n<table class=\"MsoNormalTable\" style=\"width: 100.0%; mso-cellspacing: .7pt; mso-yfti-tbllook: 1184;\" border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\n<tbody>\n<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\" style=\"text-align: center;\" align=\"center\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Colonne</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Type</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Null</span></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Valeur par d&eacute;faut</span></strong></p>\n</td>\n</tr>\n<tr style=\"mso-yfti-irow: 1;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><strong><em><span style=\"mso-fareast-font-family: \'Times New Roman\';\">id_tache</span></em></strong></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">int(11)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 2;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">nom_tache</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">varchar(255)</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">Non</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">&nbsp;</td>\n</tr>\n<tr style=\"mso-yfti-irow: 3;\">\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">description</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span style=\"mso-fareast-font-family: \'Times New Roman\';\">text</span></p>\n</td>\n<td style=\"padding: .75pt .75pt .75pt .75pt;\">\n<p class=\"MsoNormal\"><span ', 1, '2024-10-08', '2024-10-30', 4, NULL, 6, 6, 6, NULL, NULL, NULL, 7, 10, 6, 6, 2, 3, '2024-10-09 08:43:15', '2024-10-09 08:43:15', NULL, NULL, 0);
INSERT INTO `tache` (`id_tache`, `nom_tache`, `description`, `statut`, `date_debut`, `date_fin`, `priorite`, `id_tache_parente`, `id_client`, `id_departement`, `id_frequence`, `id_control`, `id_projet`, `id_point_supervision`, `responsable_principal`, `id_demandeur`, `id_batiment`, `id_ville`, `id_cat_tache`, `id_corps_metier`, `date_creation`, `date_modification`, `doc`, `user_cr`, `est_supprime`) VALUES
(23, 'T90', '<h1 id=\"isPasted\">Base de données dlog</h1><h2>Structure de la table besoins</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_besoin</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>descriptionssss</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(200)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>datetime</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:4;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_client</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr></tbody></table><h2>Déchargement des données de la table besoins</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table budgets</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_budget</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_tache</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>montant_total</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>decimal(10,0)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>montant_utilisé</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>decimal(10,0)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:5;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>datetime</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table budgets</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table client</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_client</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>adresse</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>ville</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:5;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>pays</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:6;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>telephone</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(20)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:7;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>email</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:8;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr><tr style=\"mso-yfti-irow:9;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_modification</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table client</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table controles_de_base</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_controle</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom_controle</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(200)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Déchargement des données de la table controles_de_base</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table departement</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_departement</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom_departement</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>description</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>text</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>code</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(10)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:5;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>responsable</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:6;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>telephone</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(20)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:7;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>email</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:8;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:9;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_modification</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table departement</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table etat_offre</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_etat_offre</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom_etat_offre</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(200)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Déchargement des données de la table etat_offre</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>1</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>En attente</p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>2</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Acceptée</p></td></tr><tr style=\"mso-yfti-irow:2;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>3</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Refusée</p></td></tr></tbody></table><h2>Structure de la table format</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_format</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom_format</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(100)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>description</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>text</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_user</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:5;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>created_at</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr><tr style=\"mso-yfti-irow:6;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>updated_at</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table format</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table frequence</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_frequence</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>intervalle</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>unite</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>enum(&amp;#039;Jour&amp;#039;, &amp;#039;Semaine&amp;#039;, &amp;#039;Mois&amp;#039;, &amp;#039;Année&amp;#039;)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Jour</p></td></tr><tr style=\"mso-yfti-irow:5;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_debut</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:6;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_fin</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:7;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr><tr style=\"mso-yfti-irow:8;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_modification</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table frequence</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table items_budget</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_item</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_budget</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>description</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>qte_demande</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>decimal(10,0)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:5;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>qte_validee</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>decimal(10,0)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:6;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table items_budget</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table liens_taches_supervision</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_lien</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_tache</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_point_supervision</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:4;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_lien</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>datetime</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table liens_taches_supervision</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table offres</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_offre</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>description</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>datetime</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_besoin</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:5;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_etat_offre</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr></tbody></table><h2>Déchargement des données de la table offres</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table points_de_supervision</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_point</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom_point</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(200)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr><tr style=\"mso-yfti-irow:4;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_modification</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table points_de_supervision</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table suivi_offres</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_suivi</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_offre</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_suivi</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>datetime</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:4;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_statut_suivi</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr></tbody></table><h2>Déchargement des données de la table suivi_offres</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table tache</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_tache</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom_tache</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>description</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>text</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>statut</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:5;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_debut</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:6;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_fin</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:7;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>priorite</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>enum(&amp;#039;Basse&amp;#039;, &amp;#039;Moyenne&amp;#039;, &amp;#039;Haute&amp;#039;)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Moyenne</p></td></tr><tr style=\"mso-yfti-irow:8;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_tache_parente</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:9;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_frequence</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:10;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_point_supervision</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:11;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>responsable_principal</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:12;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr><tr style=\"mso-yfti-irow:13;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_modification</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table tache</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table taches_suivantes</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_tache_suivante</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_tache_precedente</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:3;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_tache_suivantes</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr></tbody></table><h2>Déchargement des données de la table taches_suivantes</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table tache_personne</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_tache_personne</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_user</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>id_tache</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:4;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_assigne</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table tache_personne</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr></tbody></table><h2>Structure de la table type_statut_suivi</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_type_statut_suivi</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom_type_statut</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(200)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr></tbody></table><h2>Déchargement des données de la table type_statut_suivi</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>1</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>En attente</p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>2</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>En cours</p></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>3</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Point bloquant</p></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>4</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>En attente de validation</p></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>5</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Validé</p></td></tr><tr style=\"mso-yfti-irow:5;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>6</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Budget</p></td></tr><tr style=\"mso-yfti-irow:6;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>7</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Executé</p></td></tr></tbody></table><h2>Structure de la table utilisateur</h2><table border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;mso-cellspacing:.7pt;mso-yfti-tbllook:1184;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p align=\"center\" style=\"text-align:center;\"><strong>Colonne</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Type</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Null</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>Valeur par défaut</strong></p></td></tr><tr style=\"mso-yfti-irow:1;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong><em>id_utilisateur</em></strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>int(11)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:2;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>nom</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:3;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>prenom</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:4;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p><strong>email</strong></p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Oui</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>NULL</p></td></tr><tr style=\"mso-yfti-irow:5;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>mot_de_passe</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>varchar(255)</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><br></td></tr><tr style=\"mso-yfti-irow:6;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_creation</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr><tr style=\"mso-yfti-irow:7;mso-yfti-lastrow:yes;\"><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>date_modification</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>timestamp</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>Non</p></td><td style=\"padding:.75pt .75pt .75pt .75pt;\"><p>current_timestamp()</p></td></tr></tbody></table><h2>Déchargement des données de la table utilisateur</h2><table border=\"1\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" style=\"width:100.0%;border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;  mso-yfti-tbllook:1184;mso-padding-alt:0cm 5.4pt 0cm 5.4pt;\"><tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;\"><td colspan=\"5\" valign=\"top\" style=\"border:solid windowtext 1.0pt;mso-border-alt:   solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt;\">tittre</td></tr><tr style=\"mso-yfti-irow:1;\"><td valign=\"top\" style=\"width: 141px; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt;\"><p><br></p></td><td valign=\"top\" style=\"width: 141px; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;\"><p><br></p></td><td valign=\"top\" style=\"width: 141px; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;\"><p><br></p></td><td valign=\"top\" style=\"width: 141px; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;\"><p><br></p></td><td valign=\"top\" style=\"width: 141px; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;\"><p><br></p></td></tr><tr style=\"mso-yfti-irow:2;mso-yfti-lastrow:yes;\"><td valign=\"top\" style=\"width: 141px; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt;\"><p><br></p></td><td valign=\"top\" style=\"width: 141px; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;\"><p><br></p></td><td valign=\"top\" style=\"width: 141px; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;\"><p><br></p></td><td valign=\"top\" style=\"width: 141px; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;\"><p><br></p></td><td valign=\"top\" style=\"width: 141px; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt;\"><p><br></p></td></tr></tbody></table><p><br></p>', 1, '2024-10-08', '2024-10-29', 4, NULL, 5, 7, 6, NULL, NULL, NULL, 9, 10, 2, 8, 2, 8, '2024-10-09 10:00:07', '2024-10-09 12:23:43', NULL, NULL, 0);
INSERT INTO `tache` (`id_tache`, `nom_tache`, `description`, `statut`, `date_debut`, `date_fin`, `priorite`, `id_tache_parente`, `id_client`, `id_departement`, `id_frequence`, `id_control`, `id_projet`, `id_point_supervision`, `responsable_principal`, `id_demandeur`, `id_batiment`, `id_ville`, `id_cat_tache`, `id_corps_metier`, `date_creation`, `date_modification`, `doc`, `user_cr`, `est_supprime`) VALUES
(24, 'T011', '<p><strong>Dsssssssssssssss</strong></p>', 1, '2024-10-10', '2024-10-30', 3, NULL, 2, 6, 6, NULL, 23, NULL, 7, 6, 6, 6, NULL, 5, '2024-10-11 10:10:31', '2024-10-15 12:30:59', NULL, NULL, 0),
(25, 'Zora01', '<p><strong>ddddddddddddd</strong></p>', 2, '2024-10-10', '2024-10-29', 4, NULL, 3, 7, 7, NULL, 26, NULL, 6, 6, 7, 3, NULL, NULL, '2024-10-11 10:24:56', '2024-10-31 07:14:25', NULL, NULL, 0),
(26, 'Prod2', '<p>Desc</p>', 1, '2024-10-31', '2024-11-29', 3, NULL, 2, 7, 1, NULL, NULL, NULL, 8, NULL, 8, 1, 3, NULL, '2024-11-01 10:43:31', '2024-11-01 10:43:31', NULL, NULL, 0),
(30, 'Tache Mitshi1', '<p>descccc</p>', 1, '2024-11-24', '2024-11-29', 3, NULL, 3, 6, 3, NULL, NULL, NULL, 7, NULL, 8, 6, 4, 4, '2024-11-25 12:37:59', '2024-11-25 12:37:59', NULL, 7, 0),
(31, 'Tache manager1', '<p>Descccccccccccccc</p>', 1, '2024-11-22', '2024-11-27', 3, NULL, 1, 7, 4, NULL, NULL, NULL, 8, NULL, 8, 1, NULL, 2, '2024-11-25 15:08:24', '2024-11-26 11:36:18', NULL, 12, 0),
(32, 'Manager new2', '<p>desccccc Manager New 2</p>', 1, '2024-11-21', '2024-11-25', 3, NULL, 1, 6, 3, NULL, NULL, NULL, 11, NULL, 8, 1, NULL, NULL, '2024-11-26 12:34:54', '2024-11-26 12:42:43', NULL, 12, 0),
(33, 'McTitre', '<p>desc Mk</p>', 1, '2024-11-25', '2024-11-29', 2, NULL, 2, 7, 5, NULL, NULL, NULL, 11, NULL, 4, 1, NULL, NULL, '2024-11-26 12:43:53', '2024-11-26 13:52:39', NULL, 12, 0),
(34, 'tache Achat 01', '<p>Descccccccc</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 6, 7, 5, NULL, NULL, NULL, 8, 9, 8, 1, NULL, 3, '2024-11-27 10:03:32', '2024-11-27 10:03:32', NULL, 3, 0),
(35, 'tache Achat 01', '<p>Descccccccc</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 6, 7, 5, NULL, NULL, NULL, 8, 9, 8, 1, NULL, 3, '2024-11-27 10:04:40', '2024-11-27 10:04:40', NULL, 3, 0),
(36, 'Tache Bat', '<p>desc Tache Bat</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 3, 6, 3, NULL, NULL, NULL, 8, NULL, 4, 1, 5, 4, '2024-11-27 10:14:32', '2024-11-27 10:14:32', NULL, 3, 0),
(37, 'Achats Chemise', '<p>descccccc</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 2, 6, 5, NULL, NULL, NULL, 7, NULL, 1, 1, NULL, 1, '2024-11-27 10:16:48', '2024-11-27 10:16:48', NULL, 3, 0),
(38, 'TACHE PRIME', '<p>Desccccc</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 6, 7, 3, NULL, NULL, NULL, 8, NULL, NULL, 1, NULL, NULL, '2024-11-27 10:52:49', '2024-11-27 10:52:49', NULL, 3, 0),
(39, 'Tache vodacom', '<p>Desccccccccccccccc Tache Vodacom</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 3, 6, 5, NULL, NULL, NULL, 9, NULL, NULL, 1, NULL, NULL, '2024-11-27 11:42:37', '2024-11-27 11:42:37', NULL, 3, 0),
(40, 'Tache AFR', '<p>Desccccccccccccccccaaaaaaaa</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 6, 7, 4, NULL, NULL, NULL, 9, NULL, NULL, 1, NULL, NULL, '2024-11-27 11:56:49', '2024-11-27 11:56:49', NULL, 3, 0),
(41, 'Tache AFRICELL', '<p>Desccccccccccccccc</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 4, 7, 4, NULL, NULL, NULL, 9, NULL, NULL, 1, NULL, NULL, '2024-11-27 11:59:15', '2024-11-27 11:59:15', NULL, 3, 0),
(42, 'TAVVVV', '<p>DESCCCCCCCCC</p>', 1, '2024-11-26', '2024-11-29', 2, NULL, 4, 7, 4, NULL, NULL, NULL, 8, NULL, 7, 3, 8, 7, '2024-11-27 12:33:25', '2024-11-27 12:33:25', NULL, 3, 0),
(43, 'RRRRR', '<p>DESCCCCCCC</p>', 1, '2024-11-26', '2024-11-29', 4, NULL, 2, 7, 3, NULL, NULL, NULL, 7, 9, 7, 1, NULL, 4, '2024-11-27 12:47:33', '2024-11-27 12:47:33', NULL, 3, 0),
(44, 'TACHE MAN', '<p>DESCCC</p>', 1, '2024-11-26', '2024-11-29', 2, NULL, 2, 7, 5, NULL, NULL, NULL, 10, NULL, 6, 4, 4, 6, '2024-11-27 13:01:30', '2024-11-27 13:01:30', NULL, 12, 0),
(45, 'Neeeeee', '<p>Dsecccccccccccc</p>', 1, '2024-11-26', '2024-11-29', 2, NULL, 2, 7, 2, NULL, NULL, NULL, 9, NULL, 7, 4, NULL, 7, '2024-11-27 13:43:29', '2024-11-27 13:43:29', NULL, 3, 0),
(46, 'fffffffffffff', '<p>descccccccccccc</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 2, 6, 6, NULL, NULL, NULL, 12, 11, 8, 2, NULL, NULL, '2024-11-27 13:51:46', '2024-11-27 13:51:46', NULL, 12, 0),
(47, 'ccccccccccc', '<p>DESCCCCCCCCCCCCCCCCCCCCCC</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 3, 7, 6, NULL, NULL, NULL, 9, NULL, 5, 5, 6, 5, '2024-11-27 13:59:14', '2024-11-27 13:59:14', NULL, 12, 0),
(48, 'bbbbbbbb', '<p>Desccccc</p>', 1, '2024-11-26', '2024-11-29', 2, NULL, 4, 6, 4, NULL, NULL, NULL, 6, NULL, NULL, 4, NULL, NULL, '2024-11-27 14:03:36', '2024-11-27 14:03:36', NULL, 12, 0),
(49, 'vvvvvvvvvvv', '<p>DESCCCCCCCCC</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 6, 6, 4, NULL, NULL, NULL, 7, 9, NULL, 4, NULL, NULL, '2024-11-27 14:06:12', '2024-11-27 14:06:12', NULL, 12, 0),
(50, 'nnnnnnnnnn', '<p>dsssssssss</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 3, 6, 5, NULL, NULL, NULL, 8, NULL, NULL, 7, NULL, NULL, '2024-11-27 14:09:47', '2024-11-27 14:09:47', NULL, 12, 0),
(51, 'dddddddddddd', '<p>sccccccccccccccccc</p>', 1, '2024-11-26', '2024-11-29', 2, NULL, 4, 6, 7, NULL, NULL, NULL, 9, NULL, NULL, 3, NULL, NULL, '2024-11-27 15:27:34', '2024-11-27 15:27:34', NULL, 12, 0),
(52, 'FFFFFFFFFFFF', '<p>DSCCCCCCCCCCCCCCCCCC</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 4, 7, 4, NULL, NULL, NULL, 7, NULL, 7, 1, 5, 6, '2024-11-27 15:33:37', '2024-11-27 15:33:37', NULL, 12, 0),
(53, 'JJJJJJJ', '<p>NNNNNNNN</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 2, 7, 7, NULL, NULL, NULL, 9, 12, 6, 1, NULL, 4, '2024-11-27 15:35:40', '2024-11-27 15:35:40', NULL, 12, 0),
(54, 'BVVVV', '<p>SQXXX</p>', 1, '2024-11-26', '2024-11-27', 2, NULL, 8, 6, 8, NULL, NULL, NULL, 10, NULL, NULL, 1, NULL, NULL, '2024-11-27 15:37:33', '2024-11-27 15:37:33', NULL, 3, 0),
(55, 'fdddd', '<p>dscccccccccccc</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 6, 6, 7, NULL, NULL, NULL, 9, NULL, NULL, 1, NULL, NULL, '2024-11-27 15:39:24', '2024-11-27 15:39:24', NULL, 3, 0),
(56, 'vvvvvvvvvvvv', '<p>sccccccccccccc</p>', 1, '2024-11-26', '2024-11-29', 3, NULL, 8, 6, 1, NULL, NULL, NULL, 12, NULL, NULL, 1, NULL, NULL, '2024-11-27 15:41:04', '2024-11-27 15:41:04', NULL, 3, 0),
(57, 'bdddddddddddd', '<p>sccccccccccccc</p>', 1, '2024-11-26', '2024-11-27', 3, NULL, 3, 7, 1, NULL, NULL, NULL, 7, NULL, NULL, 1, NULL, NULL, '2024-11-27 15:43:08', '2024-11-27 15:43:08', NULL, 3, 0),
(58, 'hgggg', '<p>Desccccccccccccccccccc</p>', 1, '2024-11-27', '2024-11-29', 3, NULL, 2, 7, 2, NULL, NULL, NULL, 8, 7, NULL, 1, NULL, NULL, '2024-11-28 11:30:14', '2024-11-28 11:30:14', NULL, 3, 0),
(59, 'fdezzzzz', '<p>dersccccccccccc</p>', 1, '2024-11-27', '2024-11-29', 3, NULL, 2, 6, 4, NULL, NULL, NULL, 9, NULL, NULL, 1, NULL, NULL, '2024-11-28 11:31:33', '2024-11-28 11:31:33', NULL, 12, 0),
(60, 'trrrrrr', '<p>fesssssssssssssssssssssssccccccccccccc</p>', 1, '2024-11-27', '2024-11-29', 3, NULL, 2, 7, 6, NULL, NULL, NULL, 9, NULL, 4, 2, NULL, 4, '2024-11-28 11:40:25', '2024-11-28 11:40:25', NULL, 12, 0),
(61, 'trrrrrrrrrr', '<p>FESSSSSSSSSSSSSSSSSVVVVVVVVV</p>', 1, '2024-11-27', '2024-11-29', 3, NULL, 3, 6, 3, NULL, NULL, NULL, 7, NULL, NULL, 1, NULL, NULL, '2024-11-28 11:47:25', '2024-11-28 11:47:25', NULL, 3, 0),
(62, 'YYYYYYYYYYY', '<p>DESCCCCCCCCC</p>', 1, '2024-11-27', '2024-11-29', 2, NULL, 3, 6, 4, NULL, NULL, NULL, 10, NULL, NULL, 2, NULL, NULL, '2024-11-28 11:48:14', '2024-11-28 11:48:14', NULL, 12, 0),
(63, 'kkkkkk', '<p>scccccccccccccccccc</p>', 1, '2024-11-27', '2024-11-29', 2, NULL, 4, 6, 5, NULL, NULL, NULL, 10, NULL, NULL, 4, NULL, NULL, '2024-11-28 12:01:41', '2024-11-28 12:01:41', NULL, 12, 0),
(64, 'vccccc', '<p>Desccccccccc</p>', 1, '2024-11-27', '2024-11-29', 2, NULL, 3, 6, 1, NULL, NULL, NULL, 6, NULL, NULL, 2, NULL, NULL, '2024-11-28 14:17:15', '2024-11-28 14:17:15', NULL, 3, 0),
(65, 'zzeeeeeeeeee', '<p>dessssssssssssssssssssccccccccc</p>', 1, '2024-11-27', '2024-11-29', 3, NULL, 2, 6, 3, NULL, NULL, NULL, 12, NULL, NULL, 1, NULL, NULL, '2024-11-28 14:18:23', '2024-11-28 14:18:23', NULL, 3, 0),
(66, 'xxccccccc', '<p>rrrrrrrccccccccccccccccc</p>', 2, '2024-11-27', '2024-11-29', 2, NULL, 2, 7, 1, NULL, NULL, NULL, 6, NULL, 6, 1, NULL, NULL, '2024-11-28 14:19:34', '2024-11-28 14:20:56', NULL, 3, 0),
(67, 'RTEERRR', '<p>VDDDDD</p>', 2, '2024-11-27', '2024-11-29', 3, NULL, 2, 7, 5, NULL, NULL, NULL, 9, NULL, NULL, 1, NULL, NULL, '2024-11-28 14:28:44', '2024-11-28 14:29:13', NULL, 12, 0),
(68, 'gggg', '<p>dscccccccccccccc</p>', 1, '2024-12-11', '2024-12-30', 2, NULL, 1, 6, 6, NULL, NULL, NULL, 9, 11, NULL, 2, NULL, NULL, '2024-12-12 15:08:00', '2024-12-12 15:08:00', NULL, 3, 0),
(69, 'dcddd', '<p>descccccccccc</p>', 1, '2024-12-11', '2024-12-30', 2, NULL, 1, 7, 7, NULL, 27, NULL, 9, NULL, NULL, 1, NULL, NULL, '2024-12-12 15:14:50', '2024-12-12 15:14:50', NULL, 3, 0),
(70, 'fgffff', '<p>dfsssssssssssssss</p>', 1, '2024-12-11', '2024-12-30', 3, NULL, 1, 6, 4, NULL, 27, NULL, 10, NULL, NULL, 1, NULL, NULL, '2024-12-12 15:25:31', '2024-12-12 15:25:31', NULL, 3, 0),
(71, 're300', '<p>FDDDD</p>', 1, '2024-12-11', '2024-12-30', 1, NULL, 2, 6, 7, NULL, NULL, NULL, 11, NULL, NULL, 1, NULL, NULL, '2024-12-12 15:27:03', '2024-12-12 15:27:03', NULL, 3, 0);

-- --------------------------------------------------------

--
-- Structure de la table `tache_documents`
--

CREATE TABLE `tache_documents` (
  `id_tache_document` int(11) NOT NULL,
  `id_tache` int(11) DEFAULT NULL,
  `nom_document` varchar(255) NOT NULL,
  `type_document` varchar(50) DEFAULT NULL,
  `chemin_document` varchar(255) NOT NULL,
  `date_ajout` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tache_documents`
--

INSERT INTO `tache_documents` (`id_tache_document`, `id_tache`, `nom_document`, `type_document`, `chemin_document`, `date_ajout`) VALUES
(1, 2, 'word', 'Word', 'public/uploads/1c1d30e2-02bd-4980-a650-b3bfd9209e8c.doc', '2024-09-11 15:50:21'),
(2, 2, 'wordsss', 'Image', 'public/uploads/76dfff7d-ff3a-4994-9162-552e54bd70a8.png', '2024-09-16 13:06:40'),
(3, 4, 'word', 'PDF', 'public/uploads/ee9d1ca4-9fb9-4d1a-bc16-939b2deb2cac.pdf', '2024-09-19 16:39:18'),
(4, 4, 'word', 'PDF', 'public/uploads/a80f57ca-fe60-4977-a659-1086e23fc394.pdf', '2024-09-19 16:39:18'),
(5, 4, 'Image3', 'Image', 'public/uploads/d9f943b7-2168-4aec-9a52-f528a0f7b0cc.jpg', '2024-09-19 16:45:54'),
(6, 4, 'Image3', 'Image', 'public/uploads/d38cd974-4980-497d-9f3e-908f9e742cb7.png', '2024-09-19 16:45:54'),
(7, 4, 'Image3', 'Image', 'public/uploads/27077313-c0ac-455a-8c49-06546ecb94bb.png', '2024-09-19 16:45:54'),
(8, 4, 'word.dox', 'Word', 'public/uploads/8975f66f-1613-42c0-9b1d-9afc92c5ef58.doc', '2024-09-19 16:47:32'),
(9, 4, 'word', 'Word', 'public/uploads/86886257-9b33-46e8-b06f-d11d9879f553.doc', '2024-09-20 17:05:15'),
(10, 10, 'word', 'Word', 'public/uploads/47ee394e-f61e-44dc-997e-028c03ba89be.doc', '2024-09-20 17:05:36'),
(11, 4, 'wordzzzzzzzzz', 'Word', 'public/uploads/8d1b3731-3f0f-4b6b-9268-15d814e7291b.doc', '2024-09-23 10:38:59'),
(12, 16, 'ACHA', 'Word', 'public/uploads/924811a1-7077-4c70-a396-1f1f5061e6fe.pdf', '2024-09-28 14:44:57'),
(13, 10, 'ACHA', 'Word', 'public/uploads/b7e2f9e9-38da-4eb6-bdbd-3954b803384e.pdf', '2024-09-28 14:46:24'),
(14, 25, 'word', 'Word', 'public/uploads/ba3b238d-ca0f-47bc-b81a-0888e9dbb0fb.png', '2024-10-31 08:16:21'),
(15, 25, 'word.dox', 'Image', 'public/uploads/1ac97b8a-e533-4bb7-9baf-2b9e2e730f5a.png', '2024-10-31 08:16:40'),
(16, 25, 'image', 'Image', 'public/uploads/700d3531-c434-4cc7-baf8-c3c13c2c4422.png', '2024-10-31 08:24:06'),
(17, 25, 'imagesss', 'Image', 'public/uploads/c62538b6-5656-4f1d-9a59-60931fc2ec42.png', '2024-10-31 08:24:40'),
(18, 25, 'word', 'Word', 'public/uploads/3901ddb7-af18-4eed-9c42-d66c01352812.txt', '2024-10-31 08:30:14'),
(19, 25, 'wordssss', 'Word', 'public/uploads/b04c222a-a083-4b9f-867b-b125f6c9e83d.txt', '2024-10-31 09:57:17'),
(20, 25, 'wordzzz', 'Word', 'public/uploads/7a485e8d-f283-4b3d-8dd9-616394dfee34.txt', '2024-10-31 09:57:29'),
(21, 25, 'wordyy', 'Word', 'public/uploads/bfd5c59f-64b5-4b7d-80ee-39e309d40013.txt', '2024-10-31 09:57:42');

-- --------------------------------------------------------

--
-- Structure de la table `tache_tags`
--

CREATE TABLE `tache_tags` (
  `id_tache` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tache_tags`
--

INSERT INTO `tache_tags` (`id_tache`, `id_tag`) VALUES
(18, 1),
(18, 2),
(19, 3);

-- --------------------------------------------------------

--
-- Structure de la table `tags`
--

CREATE TABLE `tags` (
  `id_tag` int(11) NOT NULL,
  `nom_tag` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tags`
--

INSERT INTO `tags` (`id_tag`, `nom_tag`) VALUES
(1, 'Elect'),
(2, 'mec'),
(3, 'Electronique');

-- --------------------------------------------------------

--
-- Structure de la table `template_occupation`
--

CREATE TABLE `template_occupation` (
  `id_template` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `id_type_occupation` int(11) NOT NULL,
  `id_batiment` int(11) NOT NULL,
  `id_niveau` int(11) NOT NULL,
  `id_denomination` int(11) NOT NULL,
  `id_whse_fact` int(11) NOT NULL,
  `id_contrat` int(11) DEFAULT NULL,
  `id_objet_fact` int(11) NOT NULL,
  `desc_template` text DEFAULT NULL,
  `status_template` int(11) NOT NULL DEFAULT 1,
  `user_cr` int(11) DEFAULT 3,
  `date_actif` datetime NOT NULL,
  `date_inactif` datetime DEFAULT NULL,
  `est_supprime` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `template_occupation`
--

INSERT INTO `template_occupation` (`id_template`, `id_client`, `id_type_occupation`, `id_batiment`, `id_niveau`, `id_denomination`, `id_whse_fact`, `id_contrat`, `id_objet_fact`, `desc_template`, `status_template`, `user_cr`, `date_actif`, `date_inactif`, `est_supprime`) VALUES
(2, 1, 1, 3, 1, 1, 2, NULL, 1, 'desc', 1, 3, '2024-11-06 23:00:00', NULL, 0),
(3, 2, 1, 3, 1, 1, 2, NULL, 1, 'desc vodam template', 1, 3, '2024-11-06 23:00:00', NULL, 0),
(4, 3, 2, 3, 1, 1, 4, NULL, 1, 'DESC', 1, 3, '2024-11-10 23:00:00', NULL, 0),
(5, 5, 2, 3, 1, 1, 5, NULL, 1, 'DESC', 1, 3, '2024-11-10 23:00:00', NULL, 0),
(6, 6, 2, 3, 1, 1, 6, NULL, 2, 'DESC', 1, 3, '2024-11-10 23:00:00', NULL, 0),
(7, 6, 3, 3, 1, 1, 8, NULL, 2, 'Desc22', 2, 3, '2024-11-10 23:00:00', '2024-11-12 12:03:45', 0),
(8, 1, 2, 5, 8, 3, 9, NULL, 1, 'TEMP22', 1, 3, '2024-11-13 23:00:00', NULL, 0),
(9, 1, 2, 5, 8, 2, 10, NULL, 1, 'fffffffffff', 1, 3, '2024-11-21 23:00:00', NULL, 0),
(10, 3, 2, 1, 10, 8, 11, NULL, 2, 'cobra 11 KONNECT 2 niv', 1, 3, '2025-01-03 23:00:00', NULL, 0),
(11, 1, 1, 3, 9, 1, 14, 2, 1, 'reddddddd', 1, 3, '2025-01-08 23:00:00', NULL, 0),
(12, 1, 1, 1, 10, 4, 15, 4, 1, 'Dcl212', 1, 7, '2025-03-03 23:00:00', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `type_cat_client`
--

CREATE TABLE `type_cat_client` (
  `id_type_cat_client` int(11) NOT NULL,
  `nom_type_cat_client` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_cat_client`
--

INSERT INTO `type_cat_client` (`id_type_cat_client`, `nom_type_cat_client`) VALUES
(1, 'ordonné'),
(2, 'non ordonné');

-- --------------------------------------------------------

--
-- Structure de la table `type_client`
--

CREATE TABLE `type_client` (
  `id_type_client` int(11) NOT NULL,
  `nom_type` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_client`
--

INSERT INTO `type_client` (`id_type_client`, `nom_type`) VALUES
(1, 'Externe'),
(2, 'Interne');

-- --------------------------------------------------------

--
-- Structure de la table `type_contrat`
--

CREATE TABLE `type_contrat` (
  `id_type_contrat` int(11) NOT NULL,
  `nom_type_contrat` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_contrat`
--

INSERT INTO `type_contrat` (`id_type_contrat`, `nom_type_contrat`, `description`) VALUES
(1, 'CDI', 'Contrat à durée indéterminée, sans date de fin spécifiée.'),
(2, 'CDD', 'Contrat à durée déterminée, avec une durée fixe.'),
(3, 'Contrat de prestation de services', 'Contrat pour la réalisation d’une prestation de services.'),
(4, 'Contrat de vente', 'Contrat pour la vente de biens ou services.'),
(5, 'Contrat d\'apprentissage', 'Contrat combinant formation théorique et pratique pour les jeunes.'),
(6, 'Contrat d\'intérim', 'Contrat temporaire pour remplacer un salarié ou pour une mission temporaire.'),
(7, 'Contrat de sous-traitance', 'Contrat entre une entreprise principale et une entreprise tierce pour réaliser une prestation.'),
(8, 'Contrat d\'assurance vie', 'Contrat entre un assuré et une compagnie d\'assurance concernant des prestations en cas de décès ou survie.'),
(9, 'Contrat de location', 'Contrat pour la location d\'un bien immobilier ou matériel.'),
(10, 'Contrat de franchise', 'Contrat permettant à un franchisé de vendre un produit ou un service sous la marque d\'un franchiseur.');

-- --------------------------------------------------------

--
-- Structure de la table `type_d_occupation`
--

CREATE TABLE `type_d_occupation` (
  `id_type_d_occupation` int(11) NOT NULL,
  `nom_type_d_occupation` varchar(200) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_d_occupation`
--

INSERT INTO `type_d_occupation` (`id_type_d_occupation`, `nom_type_d_occupation`, `date_creation`) VALUES
(1, 'Dédié', '2024-11-04 10:30:24'),
(2, 'Partagé', '2024-11-04 10:30:24'),
(3, 'Réservé', '2024-11-04 10:30:24');

-- --------------------------------------------------------

--
-- Structure de la table `type_equipement`
--

CREATE TABLE `type_equipement` (
  `id_type_equipement` int(11) NOT NULL,
  `nom_type` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_equipement`
--

INSERT INTO `type_equipement` (`id_type_equipement`, `nom_type`) VALUES
(1, 'Extincteurs'),
(2, 'Détecteurs'),
(3, 'Radios');

-- --------------------------------------------------------

--
-- Structure de la table `type_instruction`
--

CREATE TABLE `type_instruction` (
  `id_type_instruction` int(11) NOT NULL,
  `nom_type_instruction` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_instruction`
--

INSERT INTO `type_instruction` (`id_type_instruction`, `nom_type_instruction`) VALUES
(1, 'OPS'),
(2, 'HSE');

-- --------------------------------------------------------

--
-- Structure de la table `type_photo`
--

CREATE TABLE `type_photo` (
  `id_type_photo` int(11) NOT NULL,
  `nom_type_photo` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_photo`
--

INSERT INTO `type_photo` (`id_type_photo`, `nom_type_photo`) VALUES
(1, 'Avant'),
(2, 'Après');

-- --------------------------------------------------------

--
-- Structure de la table `type_statut_suivi`
--

CREATE TABLE `type_statut_suivi` (
  `id_type_statut_suivi` int(11) NOT NULL,
  `nom_type_statut` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_statut_suivi`
--

INSERT INTO `type_statut_suivi` (`id_type_statut_suivi`, `nom_type_statut`) VALUES
(1, 'En attente'),
(2, 'En cours'),
(3, 'Point bloquant'),
(4, 'En attente de validation'),
(5, 'Validé'),
(6, 'Budget'),
(7, 'Executé');

-- --------------------------------------------------------

--
-- Structure de la table `type_stockage_bins`
--

CREATE TABLE `type_stockage_bins` (
  `id_type_stockage_bins` int(11) NOT NULL,
  `nom_stockage` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `type_stockage_bins`
--

INSERT INTO `type_stockage_bins` (`id_type_stockage_bins`, `nom_stockage`) VALUES
(1, 'Sec'),
(2, 'Liquide'),
(3, 'Dangereux');

-- --------------------------------------------------------

--
-- Structure de la table `user_client`
--

CREATE TABLE `user_client` (
  `id_user_client` int(11) NOT NULL,
  `id_declaration` int(11) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `id_client` int(11) DEFAULT NULL,
  `can_view` tinyint(4) NOT NULL DEFAULT 0,
  `can_edit` tinyint(4) NOT NULL DEFAULT 0,
  `can_comment` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_declaration`
--

CREATE TABLE `user_declaration` (
  `id_user_declaration` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_ville` int(11) NOT NULL,
  `can_view` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_departements`
--

CREATE TABLE `user_departements` (
  `id_user_departements` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_ville` int(11) NOT NULL,
  `id_departement` int(11) NOT NULL,
  `can_view` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_departements`
--

INSERT INTO `user_departements` (`id_user_departements`, `id_user`, `id_ville`, `id_departement`, `can_view`) VALUES
(2, 12, 1, 5, 0);

-- --------------------------------------------------------

--
-- Structure de la table `user_villes`
--

CREATE TABLE `user_villes` (
  `id_user_villes` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_ville` int(11) NOT NULL,
  `can_view` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_villes`
--

INSERT INTO `user_villes` (`id_user_villes`, `id_user`, `id_ville`, `can_view`) VALUES
(7, 3, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `user_villes_declaration`
--

CREATE TABLE `user_villes_declaration` (
  `id_user_villes_declaration` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_ville` int(11) NOT NULL,
  `can_view` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id_utilisateur` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('Admin','Owner','Manager') DEFAULT 'Owner',
  `id_ville` int(11) DEFAULT NULL,
  `id_departement` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id_utilisateur`, `nom`, `prenom`, `email`, `mot_de_passe`, `role`, `id_ville`, `id_departement`, `date_creation`, `date_modification`) VALUES
(3, 'Tite', NULL, 'titekilolo@gmail.com', '$2a$10$nQWFNzv4Kt0CHFoXx1nXF.pgvhSh/K8neOwQYw.ik3m/YAvDqa5K2', 'Admin', 1, NULL, '2024-08-29 07:33:47', '2024-11-26 11:57:58'),
(6, 'Acha', 'Umba', 'achandambi@gmail.com', '$2a$10$WFxR6cA2C9NgEDMidT4jAurtUTcoVwYReZte6YLlsL/noWl.2ijrK', 'Owner', NULL, NULL, '2024-08-30 15:39:53', '2025-03-07 09:43:58'),
(7, 'MITSHI', 'Mitshi', 'mitshi@gmail.com', '$2a$10$bQ9fnrUa1O.OigNF83GPje/g.R4rU72WvOum5cpyZ7J8.pGytly4K', 'Owner', NULL, NULL, '2024-08-30 15:40:29', '2024-08-30 15:40:29'),
(8, 'LUNDE', 'lunde', 'lunde@gmail.com', '$2a$10$5TAqpS4ojs6NtrIM6qh8/ujrd/Q0uaWnt6KLTAeFmTIc2sqVCXO9i', 'Owner', NULL, NULL, '2024-08-30 15:41:01', '2024-09-11 12:16:34'),
(9, 'FACTURIER', 'fann', 'facturier@gmail.com', '$2a$10$i4ptne8woSlatjJaEqq99u5n/i7ODKQNaDTOzJKXsoCLoO0bFwQpG', 'Owner', NULL, NULL, '2024-08-30 15:41:44', '2024-09-11 12:18:02'),
(10, 'DON', 'don', 'don@gmail.com', '$2a$10$DsltgW3U1BBhqq4yRIyk3ebJma07paXrE8k8bwfg.bvuHhOP/Bxim', 'Owner', NULL, NULL, '2024-08-30 15:42:10', '2024-08-30 15:42:10'),
(11, 'PATOU', 'patou', 'patou@gmail.com', '$2a$10$P88OACxATzuVIy/vG9bu.OX5/tZotiOmB2oc2Yf79/gCElup07hdy', 'Owner', NULL, NULL, '2024-08-30 15:42:59', '2024-08-30 15:42:59'),
(12, 'Umba', 'Jordy', 'jordy@gmail.com', '$2a$10$J3GINsZVdcx8M4RGIMWocOTZ0TXhTF/5w52A20JYFdK5CyOWdvgPW', 'Manager', 1, 7, '2024-11-25 12:42:30', '2024-11-26 12:19:52');

-- --------------------------------------------------------

--
-- Structure de la table `whse_fact`
--

CREATE TABLE `whse_fact` (
  `id_whse_fact` int(11) NOT NULL,
  `id_batiment` int(11) NOT NULL,
  `nom_whse_fact` varchar(200) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `whse_fact`
--

INSERT INTO `whse_fact` (`id_whse_fact`, `id_batiment`, `nom_whse_fact`, `date_creation`) VALUES
(1, 1, '100', '2024-11-04 12:57:07'),
(2, 3, '2000', '2024-11-05 09:26:21'),
(3, 3, '2000', '2024-11-11 14:24:47'),
(4, 3, '400', '2024-11-11 14:41:14'),
(5, 3, '800', '2024-11-11 14:45:56'),
(6, 3, '100', '2024-11-11 14:49:58'),
(7, 3, '200', '2024-11-11 14:51:28'),
(8, 3, '2000', '2024-11-12 09:55:52'),
(9, 1, NULL, '2024-11-14 14:25:52'),
(10, 1, NULL, '2024-11-22 07:44:25'),
(11, 1, NULL, '2025-01-04 12:12:23'),
(14, 3, NULL, '2025-01-09 13:04:11'),
(15, 3, NULL, '2025-03-04 15:24:05');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activite`
--
ALTER TABLE `activite`
  ADD PRIMARY KEY (`id_activite`);

--
-- Index pour la table `activite_fournisseur`
--
ALTER TABLE `activite_fournisseur`
  ADD PRIMARY KEY (`id_activite_fournisseur`);

--
-- Index pour la table `adresse`
--
ALTER TABLE `adresse`
  ADD PRIMARY KEY (`id_adresse`);

--
-- Index pour la table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id_article`);

--
-- Index pour la table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id_audit_logs`);

--
-- Index pour la table `batiment`
--
ALTER TABLE `batiment`
  ADD PRIMARY KEY (`id_batiment`);

--
-- Index pour la table `batiment_plans`
--
ALTER TABLE `batiment_plans`
  ADD PRIMARY KEY (`id_batiment_plans`),
  ADD KEY `fk_batiment` (`id_batiment`);

--
-- Index pour la table `besoins`
--
ALTER TABLE `besoins`
  ADD PRIMARY KEY (`id_besoin`),
  ADD KEY `id_projet` (`id_projet`);

--
-- Index pour la table `besoin_client`
--
ALTER TABLE `besoin_client`
  ADD PRIMARY KEY (`id_besoin_client`),
  ADD KEY `id_besoin` (`id_besoin`),
  ADD KEY `id_client` (`id_client`);

--
-- Index pour la table `besoin_offre`
--
ALTER TABLE `besoin_offre`
  ADD PRIMARY KEY (`id_besoin_offre`);

--
-- Index pour la table `bins`
--
ALTER TABLE `bins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_stockage` (`type_stockage`),
  ADD KEY `statut` (`statut`),
  ADD KEY `bins_ibfk_1` (`id_batiment`);

--
-- Index pour la table `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`id_budget`),
  ADD KEY `id_controle` (`id_controle`),
  ADD KEY `id_tache` (`id_tache`);

--
-- Index pour la table `budgets`
--
ALTER TABLE `budgets`
  ADD PRIMARY KEY (`id_budget`),
  ADD KEY `id_besoin` (`id_besoin`);

--
-- Index pour la table `budgets_tag`
--
ALTER TABLE `budgets_tag`
  ADD PRIMARY KEY (`id_budget`,`id_tag`) USING BTREE,
  ADD KEY `id_tag` (`id_tag`);

--
-- Index pour la table `bureaux`
--
ALTER TABLE `bureaux`
  ADD PRIMARY KEY (`id_bureau`),
  ADD KEY `id_batiment` (`id_batiment`);

--
-- Index pour la table `cat client`
--
ALTER TABLE `cat client`
  ADD PRIMARY KEY (`id_cat_client`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_categorie`);

--
-- Index pour la table `categorietache`
--
ALTER TABLE `categorietache`
  ADD PRIMARY KEY (`id_cat_tache`);

--
-- Index pour la table `categorie_tache`
--
ALTER TABLE `categorie_tache`
  ADD PRIMARY KEY (`id_categorie_tache`),
  ADD KEY `id_tache` (`id_tache`);

--
-- Index pour la table `cat_inspection`
--
ALTER TABLE `cat_inspection`
  ADD PRIMARY KEY (`id_cat_inspection`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id_client`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `contrat`
--
ALTER TABLE `contrat`
  ADD PRIMARY KEY (`id_contrat`),
  ADD KEY `id_client` (`id_client`);

--
-- Index pour la table `controles_de_base_tags`
--
ALTER TABLE `controles_de_base_tags`
  ADD PRIMARY KEY (`id_controle_de_base`,`id_tag`) USING BTREE,
  ADD KEY `id_tag` (`id_tag`);

--
-- Index pour la table `controle_client`
--
ALTER TABLE `controle_client`
  ADD PRIMARY KEY (`id_controle_client`);

--
-- Index pour la table `controle_de_base`
--
ALTER TABLE `controle_de_base`
  ADD PRIMARY KEY (`id_controle`),
  ADD KEY `id_departement` (`id_departement`),
  ADD KEY `id_format` (`id_format`),
  ADD KEY `id_frequence` (`id_frequence`);

--
-- Index pour la table `controle_responsable`
--
ALTER TABLE `controle_responsable`
  ADD PRIMARY KEY (`id_controle_responsable`);

--
-- Index pour la table `corpsmetier`
--
ALTER TABLE `corpsmetier`
  ADD PRIMARY KEY (`id_corps_metier`);

--
-- Index pour la table `declaration_super`
--
ALTER TABLE `declaration_super`
  ADD PRIMARY KEY (`id_declaration_super`),
  ADD UNIQUE KEY `unique_template_periode` (`id_template`,`periode`);

--
-- Index pour la table `declaration_superficie`
--
ALTER TABLE `declaration_superficie`
  ADD PRIMARY KEY (`id_declaration_superficie`);

--
-- Index pour la table `declaration_super_batiment`
--
ALTER TABLE `declaration_super_batiment`
  ADD PRIMARY KEY (`id_declaration_super_batiment`),
  ADD KEY `id_batiment` (`id_batiment`);

--
-- Index pour la table `denomination_bat`
--
ALTER TABLE `denomination_bat`
  ADD PRIMARY KEY (`id_denomination_bat`),
  ADD KEY `id_batiment` (`id_batiment`);

--
-- Index pour la table `departement`
--
ALTER TABLE `departement`
  ADD PRIMARY KEY (`id_departement`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_departement_responsable` (`responsable`),
  ADD KEY `idx_departement_est_supprime` (`est_supprime`);

--
-- Index pour la table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id_document`);

--
-- Index pour la table `documents_batiment`
--
ALTER TABLE `documents_batiment`
  ADD PRIMARY KEY (`id_document`);

--
-- Index pour la table `documents_offre`
--
ALTER TABLE `documents_offre`
  ADD PRIMARY KEY (`id_document`),
  ADD KEY `id_offre` (`id_offre`);

--
-- Index pour la table `document_projet`
--
ALTER TABLE `document_projet`
  ADD PRIMARY KEY (`id_document`);

--
-- Index pour la table `entrepots`
--
ALTER TABLE `entrepots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_batiment` (`id_batiment`);

--
-- Index pour la table `equipments`
--
ALTER TABLE `equipments`
  ADD PRIMARY KEY (`id_equipement`),
  ADD KEY `fk_batiments` (`id_batiment`),
  ADD KEY `equipments_ibfk_1` (`id_type_equipement`),
  ADD KEY `status` (`status`),
  ADD KEY `id_bin` (`id_bin`),
  ADD KEY `id_bureau` (`id_bureau`);

--
-- Index pour la table `format`
--
ALTER TABLE `format`
  ADD PRIMARY KEY (`id_format`);

--
-- Index pour la table `fournisseur`
--
ALTER TABLE `fournisseur`
  ADD PRIMARY KEY (`id_fournisseur`);

--
-- Index pour la table `frequence`
--
ALTER TABLE `frequence`
  ADD PRIMARY KEY (`id_frequence`);

--
-- Index pour la table `inspections`
--
ALTER TABLE `inspections`
  ADD PRIMARY KEY (`id_inspection`),
  ADD KEY `id_type_instruction` (`id_type_instruction`);

--
-- Index pour la table `inspection_img`
--
ALTER TABLE `inspection_img`
  ADD PRIMARY KEY (`id_inspection_img`);

--
-- Index pour la table `maintenances_bins`
--
ALTER TABLE `maintenances_bins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bin` (`id_bin`);

--
-- Index pour la table `maintenance_logs`
--
ALTER TABLE `maintenance_logs`
  ADD PRIMARY KEY (`id_maintenance`),
  ADD KEY `fk_equipment` (`id_equipement`),
  ADD KEY `status` (`status`);

--
-- Index pour la table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `niveau_batiment`
--
ALTER TABLE `niveau_batiment`
  ADD PRIMARY KEY (`id_niveau`),
  ADD KEY `id_batiment` (`id_batiment`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id_notifications`);

--
-- Index pour la table `objet_fact`
--
ALTER TABLE `objet_fact`
  ADD PRIMARY KEY (`id_objet_fact`);

--
-- Index pour la table `offres`
--
ALTER TABLE `offres`
  ADD PRIMARY KEY (`id_offre`);

--
-- Index pour la table `offre_article`
--
ALTER TABLE `offre_article`
  ADD PRIMARY KEY (`id_offre_article`),
  ADD KEY `id_offre` (`id_offre`),
  ADD KEY `id_article` (`id_article`);

--
-- Index pour la table `pays`
--
ALTER TABLE `pays`
  ADD PRIMARY KEY (`id_pays`);

--
-- Index pour la table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id_permission`);

--
-- Index pour la table `permissions_declaration`
--
ALTER TABLE `permissions_declaration`
  ADD PRIMARY KEY (`id_permissions_declaration`);

--
-- Index pour la table `permissions_tache`
--
ALTER TABLE `permissions_tache`
  ADD PRIMARY KEY (`id_permissions_tache`);

--
-- Index pour la table `points_de_supervision`
--
ALTER TABLE `points_de_supervision`
  ADD PRIMARY KEY (`id_point`);

--
-- Index pour la table `priorite`
--
ALTER TABLE `priorite`
  ADD PRIMARY KEY (`id_priorite`);

--
-- Index pour la table `projet`
--
ALTER TABLE `projet`
  ADD PRIMARY KEY (`id_projet`),
  ADD KEY `projet_ibfk_1` (`chef_projet`),
  ADD KEY `client` (`client`),
  ADD KEY `statut` (`statut`);

--
-- Index pour la table `projet_batiment`
--
ALTER TABLE `projet_batiment`
  ADD PRIMARY KEY (`id_projet_entite`),
  ADD KEY `id_batiment` (`id_batiment`),
  ADD KEY `id_projet` (`id_projet`);

--
-- Index pour la table `projet_client`
--
ALTER TABLE `projet_client`
  ADD PRIMARY KEY (`id_projet_client`),
  ADD KEY `id_client` (`id_client`),
  ADD KEY `id_projet` (`id_projet`);

--
-- Index pour la table `projet_suivi`
--
ALTER TABLE `projet_suivi`
  ADD PRIMARY KEY (`id_projet_suivi`),
  ADD KEY `id_projet` (`id_projet`),
  ADD KEY `id_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `projet_suivi_images`
--
ALTER TABLE `projet_suivi_images`
  ADD PRIMARY KEY (`id_image`),
  ADD KEY `id_projet_suivi` (`id_projet_suivi`);

--
-- Index pour la table `projet_tag`
--
ALTER TABLE `projet_tag`
  ADD PRIMARY KEY (`id_projet`,`id_tag`) USING BTREE,
  ADD KEY `id_tag` (`id_tag`);

--
-- Index pour la table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `status_batiment`
--
ALTER TABLE `status_batiment`
  ADD PRIMARY KEY (`id_status_batiment`);

--
-- Index pour la table `statut_bins`
--
ALTER TABLE `statut_bins`
  ADD PRIMARY KEY (`id_statut_bins`);

--
-- Index pour la table `statut_declaration`
--
ALTER TABLE `statut_declaration`
  ADD PRIMARY KEY (`id_statut_declaration`);

--
-- Index pour la table `statut_equipement`
--
ALTER TABLE `statut_equipement`
  ADD PRIMARY KEY (`id_statut_equipement`);

--
-- Index pour la table `statut_maintenance`
--
ALTER TABLE `statut_maintenance`
  ADD PRIMARY KEY (`id_statut_maintenance`);

--
-- Index pour la table `statut_template`
--
ALTER TABLE `statut_template`
  ADD PRIMARY KEY (`id_statut_template`);

--
-- Index pour la table `stocks_equipements`
--
ALTER TABLE `stocks_equipements`
  ADD PRIMARY KEY (`id_stock`),
  ADD KEY `id_type_equipement` (`id_type_equipement`);

--
-- Index pour la table `submenus`
--
ALTER TABLE `submenus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Index pour la table `suivi_controle_de_base`
--
ALTER TABLE `suivi_controle_de_base`
  ADD PRIMARY KEY (`id_suivi_controle`),
  ADD KEY `id_controle` (`id_controle`);

--
-- Index pour la table `suivi_offres`
--
ALTER TABLE `suivi_offres`
  ADD PRIMARY KEY (`id_suivi`),
  ADD KEY `id_offre` (`id_offre`);

--
-- Index pour la table `suivi_tache`
--
ALTER TABLE `suivi_tache`
  ADD PRIMARY KEY (`id_suivi`),
  ADD KEY `id_tache` (`id_tache`),
  ADD KEY `responsable` (`effectue_par`),
  ADD KEY `status` (`status`);

--
-- Index pour la table `tache`
--
ALTER TABLE `tache`
  ADD PRIMARY KEY (`id_tache`),
  ADD KEY `id_tache_parente` (`id_tache_parente`),
  ADD KEY `id_point_supervision` (`id_point_supervision`),
  ADD KEY `responsable_principal` (`responsable_principal`),
  ADD KEY `statut` (`statut`),
  ADD KEY `id_frequence` (`id_frequence`),
  ADD KEY `id_control` (`id_control`),
  ADD KEY `id_client` (`id_client`);

--
-- Index pour la table `tache_documents`
--
ALTER TABLE `tache_documents`
  ADD PRIMARY KEY (`id_tache_document`);

--
-- Index pour la table `tache_tags`
--
ALTER TABLE `tache_tags`
  ADD PRIMARY KEY (`id_tache`,`id_tag`),
  ADD KEY `id_tag` (`id_tag`);

--
-- Index pour la table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id_tag`);

--
-- Index pour la table `template_occupation`
--
ALTER TABLE `template_occupation`
  ADD PRIMARY KEY (`id_template`),
  ADD KEY `id_client` (`id_client`),
  ADD KEY `id_niveau` (`id_niveau`),
  ADD KEY `id_batiment` (`id_batiment`),
  ADD KEY `id_denomination` (`id_denomination`),
  ADD KEY `id_type_occupation` (`id_type_occupation`),
  ADD KEY `id_whse_fact` (`id_whse_fact`),
  ADD KEY `status_template` (`status_template`);

--
-- Index pour la table `type_cat_client`
--
ALTER TABLE `type_cat_client`
  ADD PRIMARY KEY (`id_type_cat_client`);

--
-- Index pour la table `type_client`
--
ALTER TABLE `type_client`
  ADD PRIMARY KEY (`id_type_client`);

--
-- Index pour la table `type_contrat`
--
ALTER TABLE `type_contrat`
  ADD PRIMARY KEY (`id_type_contrat`);

--
-- Index pour la table `type_d_occupation`
--
ALTER TABLE `type_d_occupation`
  ADD PRIMARY KEY (`id_type_d_occupation`);

--
-- Index pour la table `type_equipement`
--
ALTER TABLE `type_equipement`
  ADD PRIMARY KEY (`id_type_equipement`);

--
-- Index pour la table `type_instruction`
--
ALTER TABLE `type_instruction`
  ADD PRIMARY KEY (`id_type_instruction`);

--
-- Index pour la table `type_photo`
--
ALTER TABLE `type_photo`
  ADD PRIMARY KEY (`id_type_photo`);

--
-- Index pour la table `type_statut_suivi`
--
ALTER TABLE `type_statut_suivi`
  ADD PRIMARY KEY (`id_type_statut_suivi`);

--
-- Index pour la table `type_stockage_bins`
--
ALTER TABLE `type_stockage_bins`
  ADD PRIMARY KEY (`id_type_stockage_bins`);

--
-- Index pour la table `user_client`
--
ALTER TABLE `user_client`
  ADD PRIMARY KEY (`id_user_client`);

--
-- Index pour la table `user_declaration`
--
ALTER TABLE `user_declaration`
  ADD PRIMARY KEY (`id_user_declaration`);

--
-- Index pour la table `user_departements`
--
ALTER TABLE `user_departements`
  ADD PRIMARY KEY (`id_user_departements`);

--
-- Index pour la table `user_villes`
--
ALTER TABLE `user_villes`
  ADD PRIMARY KEY (`id_user_villes`);

--
-- Index pour la table `user_villes_declaration`
--
ALTER TABLE `user_villes_declaration`
  ADD PRIMARY KEY (`id_user_villes_declaration`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id_utilisateur`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_utilisateur_id` (`id_utilisateur`),
  ADD KEY `id_departement` (`id_departement`);

--
-- Index pour la table `whse_fact`
--
ALTER TABLE `whse_fact`
  ADD PRIMARY KEY (`id_whse_fact`),
  ADD KEY `id_batiment` (`id_batiment`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activite`
--
ALTER TABLE `activite`
  MODIFY `id_activite` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `activite_fournisseur`
--
ALTER TABLE `activite_fournisseur`
  MODIFY `id_activite_fournisseur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `adresse`
--
ALTER TABLE `adresse`
  MODIFY `id_adresse` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `articles`
--
ALTER TABLE `articles`
  MODIFY `id_article` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10004;

--
-- AUTO_INCREMENT pour la table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id_audit_logs` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT pour la table `batiment`
--
ALTER TABLE `batiment`
  MODIFY `id_batiment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `batiment_plans`
--
ALTER TABLE `batiment_plans`
  MODIFY `id_batiment_plans` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `besoins`
--
ALTER TABLE `besoins`
  MODIFY `id_besoin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `besoin_client`
--
ALTER TABLE `besoin_client`
  MODIFY `id_besoin_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `besoin_offre`
--
ALTER TABLE `besoin_offre`
  MODIFY `id_besoin_offre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `bins`
--
ALTER TABLE `bins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `budget`
--
ALTER TABLE `budget`
  MODIFY `id_budget` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `budgets`
--
ALTER TABLE `budgets`
  MODIFY `id_budget` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `bureaux`
--
ALTER TABLE `bureaux`
  MODIFY `id_bureau` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `cat client`
--
ALTER TABLE `cat client`
  MODIFY `id_cat_client` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id_categorie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `categorietache`
--
ALTER TABLE `categorietache`
  MODIFY `id_cat_tache` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `categorie_tache`
--
ALTER TABLE `categorie_tache`
  MODIFY `id_categorie_tache` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `cat_inspection`
--
ALTER TABLE `cat_inspection`
  MODIFY `id_cat_inspection` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `contrat`
--
ALTER TABLE `contrat`
  MODIFY `id_contrat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `controle_client`
--
ALTER TABLE `controle_client`
  MODIFY `id_controle_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `controle_de_base`
--
ALTER TABLE `controle_de_base`
  MODIFY `id_controle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `controle_responsable`
--
ALTER TABLE `controle_responsable`
  MODIFY `id_controle_responsable` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `corpsmetier`
--
ALTER TABLE `corpsmetier`
  MODIFY `id_corps_metier` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT pour la table `declaration_super`
--
ALTER TABLE `declaration_super`
  MODIFY `id_declaration_super` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT pour la table `declaration_superficie`
--
ALTER TABLE `declaration_superficie`
  MODIFY `id_declaration_superficie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `declaration_super_batiment`
--
ALTER TABLE `declaration_super_batiment`
  MODIFY `id_declaration_super_batiment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `denomination_bat`
--
ALTER TABLE `denomination_bat`
  MODIFY `id_denomination_bat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `departement`
--
ALTER TABLE `departement`
  MODIFY `id_departement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `documents`
--
ALTER TABLE `documents`
  MODIFY `id_document` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `documents_batiment`
--
ALTER TABLE `documents_batiment`
  MODIFY `id_document` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `documents_offre`
--
ALTER TABLE `documents_offre`
  MODIFY `id_document` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `document_projet`
--
ALTER TABLE `document_projet`
  MODIFY `id_document` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `entrepots`
--
ALTER TABLE `entrepots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `equipments`
--
ALTER TABLE `equipments`
  MODIFY `id_equipement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `format`
--
ALTER TABLE `format`
  MODIFY `id_format` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `fournisseur`
--
ALTER TABLE `fournisseur`
  MODIFY `id_fournisseur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `frequence`
--
ALTER TABLE `frequence`
  MODIFY `id_frequence` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `inspections`
--
ALTER TABLE `inspections`
  MODIFY `id_inspection` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `inspection_img`
--
ALTER TABLE `inspection_img`
  MODIFY `id_inspection_img` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT pour la table `maintenances_bins`
--
ALTER TABLE `maintenances_bins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `maintenance_logs`
--
ALTER TABLE `maintenance_logs`
  MODIFY `id_maintenance` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `niveau_batiment`
--
ALTER TABLE `niveau_batiment`
  MODIFY `id_niveau` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id_notifications` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=257;

--
-- AUTO_INCREMENT pour la table `objet_fact`
--
ALTER TABLE `objet_fact`
  MODIFY `id_objet_fact` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `offres`
--
ALTER TABLE `offres`
  MODIFY `id_offre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `offre_article`
--
ALTER TABLE `offre_article`
  MODIFY `id_offre_article` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `pays`
--
ALTER TABLE `pays`
  MODIFY `id_pays` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `permission`
--
ALTER TABLE `permission`
  MODIFY `id_permission` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT pour la table `permissions_declaration`
--
ALTER TABLE `permissions_declaration`
  MODIFY `id_permissions_declaration` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT pour la table `permissions_tache`
--
ALTER TABLE `permissions_tache`
  MODIFY `id_permissions_tache` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT pour la table `points_de_supervision`
--
ALTER TABLE `points_de_supervision`
  MODIFY `id_point` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `priorite`
--
ALTER TABLE `priorite`
  MODIFY `id_priorite` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `projet`
--
ALTER TABLE `projet`
  MODIFY `id_projet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `projet_batiment`
--
ALTER TABLE `projet_batiment`
  MODIFY `id_projet_entite` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `projet_client`
--
ALTER TABLE `projet_client`
  MODIFY `id_projet_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `projet_suivi`
--
ALTER TABLE `projet_suivi`
  MODIFY `id_projet_suivi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `projet_suivi_images`
--
ALTER TABLE `projet_suivi_images`
  MODIFY `id_image` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `provinces`
--
ALTER TABLE `provinces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `status_batiment`
--
ALTER TABLE `status_batiment`
  MODIFY `id_status_batiment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `statut_bins`
--
ALTER TABLE `statut_bins`
  MODIFY `id_statut_bins` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `statut_declaration`
--
ALTER TABLE `statut_declaration`
  MODIFY `id_statut_declaration` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `statut_equipement`
--
ALTER TABLE `statut_equipement`
  MODIFY `id_statut_equipement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `statut_maintenance`
--
ALTER TABLE `statut_maintenance`
  MODIFY `id_statut_maintenance` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `statut_template`
--
ALTER TABLE `statut_template`
  MODIFY `id_statut_template` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `stocks_equipements`
--
ALTER TABLE `stocks_equipements`
  MODIFY `id_stock` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `submenus`
--
ALTER TABLE `submenus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT pour la table `suivi_controle_de_base`
--
ALTER TABLE `suivi_controle_de_base`
  MODIFY `id_suivi_controle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `suivi_offres`
--
ALTER TABLE `suivi_offres`
  MODIFY `id_suivi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `suivi_tache`
--
ALTER TABLE `suivi_tache`
  MODIFY `id_suivi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `tache`
--
ALTER TABLE `tache`
  MODIFY `id_tache` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT pour la table `tache_documents`
--
ALTER TABLE `tache_documents`
  MODIFY `id_tache_document` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `tags`
--
ALTER TABLE `tags`
  MODIFY `id_tag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `template_occupation`
--
ALTER TABLE `template_occupation`
  MODIFY `id_template` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `type_cat_client`
--
ALTER TABLE `type_cat_client`
  MODIFY `id_type_cat_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `type_client`
--
ALTER TABLE `type_client`
  MODIFY `id_type_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `type_contrat`
--
ALTER TABLE `type_contrat`
  MODIFY `id_type_contrat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `type_d_occupation`
--
ALTER TABLE `type_d_occupation`
  MODIFY `id_type_d_occupation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `type_equipement`
--
ALTER TABLE `type_equipement`
  MODIFY `id_type_equipement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `type_instruction`
--
ALTER TABLE `type_instruction`
  MODIFY `id_type_instruction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `type_photo`
--
ALTER TABLE `type_photo`
  MODIFY `id_type_photo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `type_statut_suivi`
--
ALTER TABLE `type_statut_suivi`
  MODIFY `id_type_statut_suivi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `type_stockage_bins`
--
ALTER TABLE `type_stockage_bins`
  MODIFY `id_type_stockage_bins` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `user_client`
--
ALTER TABLE `user_client`
  MODIFY `id_user_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `user_declaration`
--
ALTER TABLE `user_declaration`
  MODIFY `id_user_declaration` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `user_departements`
--
ALTER TABLE `user_departements`
  MODIFY `id_user_departements` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `user_villes`
--
ALTER TABLE `user_villes`
  MODIFY `id_user_villes` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `user_villes_declaration`
--
ALTER TABLE `user_villes_declaration`
  MODIFY `id_user_villes_declaration` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id_utilisateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `whse_fact`
--
ALTER TABLE `whse_fact`
  MODIFY `id_whse_fact` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `batiment_plans`
--
ALTER TABLE `batiment_plans`
  ADD CONSTRAINT `fk_batiment` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE;

--
-- Contraintes pour la table `besoin_client`
--
ALTER TABLE `besoin_client`
  ADD CONSTRAINT `besoin_client_ibfk_1` FOREIGN KEY (`id_besoin`) REFERENCES `besoins` (`id_besoin`) ON DELETE CASCADE,
  ADD CONSTRAINT `besoin_client_ibfk_2` FOREIGN KEY (`id_client`) REFERENCES `client` (`id_client`) ON DELETE CASCADE;

--
-- Contraintes pour la table `bins`
--
ALTER TABLE `bins`
  ADD CONSTRAINT `bins_ibfk_1` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE,
  ADD CONSTRAINT `bins_ibfk_2` FOREIGN KEY (`type_stockage`) REFERENCES `type_stockage_bins` (`id_type_stockage_bins`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bins_ibfk_3` FOREIGN KEY (`statut`) REFERENCES `statut_bins` (`id_statut_bins`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `budget_ibfk_1` FOREIGN KEY (`id_controle`) REFERENCES `controle_de_base` (`id_controle`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `budget_ibfk_2` FOREIGN KEY (`id_tache`) REFERENCES `tache` (`id_tache`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `budgets`
--
ALTER TABLE `budgets`
  ADD CONSTRAINT `budgets_ibfk_1` FOREIGN KEY (`id_besoin`) REFERENCES `besoins` (`id_besoin`);

--
-- Contraintes pour la table `budgets_tag`
--
ALTER TABLE `budgets_tag`
  ADD CONSTRAINT `budgets_tag_ibfk_1` FOREIGN KEY (`id_budget`) REFERENCES `budget` (`id_budget`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `budgets_tag_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tags` (`id_tag`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `bureaux`
--
ALTER TABLE `bureaux`
  ADD CONSTRAINT `bureaux_ibfk_1` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `categorie_tache`
--
ALTER TABLE `categorie_tache`
  ADD CONSTRAINT `categorie_tache_ibfk_1` FOREIGN KEY (`id_tache`) REFERENCES `tache` (`id_tache`) ON DELETE CASCADE;

--
-- Contraintes pour la table `contrat`
--
ALTER TABLE `contrat`
  ADD CONSTRAINT `contrat_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `client` (`id_client`);

--
-- Contraintes pour la table `controles_de_base_tags`
--
ALTER TABLE `controles_de_base_tags`
  ADD CONSTRAINT `controles_de_base_tags_ibfk_1` FOREIGN KEY (`id_controle_de_base`) REFERENCES `controle_de_base` (`id_controle`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `controles_de_base_tags_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tags` (`id_tag`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `controle_de_base`
--
ALTER TABLE `controle_de_base`
  ADD CONSTRAINT `controle_de_base_ibfk_2` FOREIGN KEY (`id_departement`) REFERENCES `departement` (`id_departement`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `controle_de_base_ibfk_3` FOREIGN KEY (`id_format`) REFERENCES `format` (`id_format`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `controle_de_base_ibfk_4` FOREIGN KEY (`id_frequence`) REFERENCES `frequence` (`id_frequence`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `declaration_super_batiment`
--
ALTER TABLE `declaration_super_batiment`
  ADD CONSTRAINT `declaration_super_batiment_ibfk_2` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE;

--
-- Contraintes pour la table `denomination_bat`
--
ALTER TABLE `denomination_bat`
  ADD CONSTRAINT `denomination_bat_ibfk_1` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `documents_offre`
--
ALTER TABLE `documents_offre`
  ADD CONSTRAINT `documents_offre_ibfk_1` FOREIGN KEY (`id_offre`) REFERENCES `offres` (`id_offre`);

--
-- Contraintes pour la table `entrepots`
--
ALTER TABLE `entrepots`
  ADD CONSTRAINT `entrepots_ibfk_1` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`);

--
-- Contraintes pour la table `equipments`
--
ALTER TABLE `equipments`
  ADD CONSTRAINT `equipments_ibfk_1` FOREIGN KEY (`id_type_equipement`) REFERENCES `articles` (`id_article`) ON DELETE CASCADE,
  ADD CONSTRAINT `equipments_ibfk_2` FOREIGN KEY (`status`) REFERENCES `statut_equipement` (`id_statut_equipement`) ON DELETE CASCADE,
  ADD CONSTRAINT `equipments_ibfk_3` FOREIGN KEY (`id_bin`) REFERENCES `bins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `equipments_ibfk_4` FOREIGN KEY (`id_bureau`) REFERENCES `bureaux` (`id_bureau`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_batiments` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE;

--
-- Contraintes pour la table `maintenances_bins`
--
ALTER TABLE `maintenances_bins`
  ADD CONSTRAINT `maintenances_bins_ibfk_1` FOREIGN KEY (`id_bin`) REFERENCES `bins` (`id`);

--
-- Contraintes pour la table `maintenance_logs`
--
ALTER TABLE `maintenance_logs`
  ADD CONSTRAINT `fk_equipment` FOREIGN KEY (`id_equipement`) REFERENCES `equipments` (`id_equipement`) ON DELETE CASCADE,
  ADD CONSTRAINT `maintenance_logs_ibfk_1` FOREIGN KEY (`status`) REFERENCES `statut_equipement` (`id_statut_equipement`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `niveau_batiment`
--
ALTER TABLE `niveau_batiment`
  ADD CONSTRAINT `niveau_batiment_ibfk_1` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `offre_article`
--
ALTER TABLE `offre_article`
  ADD CONSTRAINT `offre_article_ibfk_1` FOREIGN KEY (`id_offre`) REFERENCES `offres` (`id_offre`),
  ADD CONSTRAINT `offre_article_ibfk_2` FOREIGN KEY (`id_article`) REFERENCES `articles` (`id_article`);

--
-- Contraintes pour la table `projet`
--
ALTER TABLE `projet`
  ADD CONSTRAINT `projet_ibfk_1` FOREIGN KEY (`chef_projet`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projet_ibfk_2` FOREIGN KEY (`client`) REFERENCES `client` (`id_client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projet_ibfk_3` FOREIGN KEY (`statut`) REFERENCES `type_statut_suivi` (`id_type_statut_suivi`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `projet_batiment`
--
ALTER TABLE `projet_batiment`
  ADD CONSTRAINT `projet_batiment_ibfk_1` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projet_batiment_ibfk_2` FOREIGN KEY (`id_projet`) REFERENCES `projet` (`id_projet`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `projet_client`
--
ALTER TABLE `projet_client`
  ADD CONSTRAINT `projet_client_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `client` (`id_client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projet_client_ibfk_2` FOREIGN KEY (`id_projet`) REFERENCES `projet` (`id_projet`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `projet_suivi`
--
ALTER TABLE `projet_suivi`
  ADD CONSTRAINT `projet_suivi_ibfk_1` FOREIGN KEY (`id_projet`) REFERENCES `projet` (`id_projet`),
  ADD CONSTRAINT `projet_suivi_ibfk_2` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `projet_suivi_images`
--
ALTER TABLE `projet_suivi_images`
  ADD CONSTRAINT `projet_suivi_images_ibfk_1` FOREIGN KEY (`id_projet_suivi`) REFERENCES `projet_suivi` (`id_projet_suivi`);

--
-- Contraintes pour la table `projet_tag`
--
ALTER TABLE `projet_tag`
  ADD CONSTRAINT `projet_tag_ibfk_1` FOREIGN KEY (`id_projet`) REFERENCES `projet` (`id_projet`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projet_tag_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tags` (`id_tag`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `stocks_equipements`
--
ALTER TABLE `stocks_equipements`
  ADD CONSTRAINT `stocks_equipements_ibfk_1` FOREIGN KEY (`id_type_equipement`) REFERENCES `articles` (`id_article`) ON DELETE CASCADE;

--
-- Contraintes pour la table `submenus`
--
ALTER TABLE `submenus`
  ADD CONSTRAINT `submenus_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `suivi_controle_de_base`
--
ALTER TABLE `suivi_controle_de_base`
  ADD CONSTRAINT `suivi_controle_de_base_ibfk_1` FOREIGN KEY (`id_controle`) REFERENCES `controle_de_base` (`id_controle`) ON DELETE CASCADE;

--
-- Contraintes pour la table `suivi_tache`
--
ALTER TABLE `suivi_tache`
  ADD CONSTRAINT `suivi_tache_ibfk_1` FOREIGN KEY (`id_tache`) REFERENCES `tache` (`id_tache`) ON DELETE CASCADE,
  ADD CONSTRAINT `suivi_tache_ibfk_2` FOREIGN KEY (`effectue_par`) REFERENCES `utilisateur` (`id_utilisateur`),
  ADD CONSTRAINT `suivi_tache_ibfk_3` FOREIGN KEY (`status`) REFERENCES `type_statut_suivi` (`id_type_statut_suivi`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `tache`
--
ALTER TABLE `tache`
  ADD CONSTRAINT `tache_ibfk_1` FOREIGN KEY (`id_tache_parente`) REFERENCES `tache` (`id_tache`) ON DELETE SET NULL,
  ADD CONSTRAINT `tache_ibfk_2` FOREIGN KEY (`id_point_supervision`) REFERENCES `points_de_supervision` (`id_point`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tache_ibfk_3` FOREIGN KEY (`responsable_principal`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tache_ibfk_4` FOREIGN KEY (`statut`) REFERENCES `type_statut_suivi` (`id_type_statut_suivi`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tache_ibfk_5` FOREIGN KEY (`id_frequence`) REFERENCES `frequence` (`id_frequence`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tache_ibfk_6` FOREIGN KEY (`id_control`) REFERENCES `controle_de_base` (`id_controle`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tache_ibfk_7` FOREIGN KEY (`id_client`) REFERENCES `client` (`id_client`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `tache_tags`
--
ALTER TABLE `tache_tags`
  ADD CONSTRAINT `tache_tags_ibfk_1` FOREIGN KEY (`id_tache`) REFERENCES `tache` (`id_tache`),
  ADD CONSTRAINT `tache_tags_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tags` (`id_tag`);

--
-- Contraintes pour la table `template_occupation`
--
ALTER TABLE `template_occupation`
  ADD CONSTRAINT `template_occupation_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `client` (`id_client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `template_occupation_ibfk_2` FOREIGN KEY (`id_niveau`) REFERENCES `niveau_batiment` (`id_niveau`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `template_occupation_ibfk_3` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `template_occupation_ibfk_4` FOREIGN KEY (`id_denomination`) REFERENCES `denomination_bat` (`id_denomination_bat`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `template_occupation_ibfk_5` FOREIGN KEY (`id_type_occupation`) REFERENCES `type_d_occupation` (`id_type_d_occupation`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `template_occupation_ibfk_6` FOREIGN KEY (`id_whse_fact`) REFERENCES `whse_fact` (`id_whse_fact`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `template_occupation_ibfk_7` FOREIGN KEY (`status_template`) REFERENCES `statut_template` (`id_statut_template`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD CONSTRAINT `utilisateur_ibfk_1` FOREIGN KEY (`id_departement`) REFERENCES `departement` (`id_departement`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `whse_fact`
--
ALTER TABLE `whse_fact`
  ADD CONSTRAINT `whse_fact_ibfk_1` FOREIGN KEY (`id_batiment`) REFERENCES `batiment` (`id_batiment`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
