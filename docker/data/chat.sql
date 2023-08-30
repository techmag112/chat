-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: db2:3306
-- Время создания: Авг 27 2023 г., 14:42
-- Версия сервера: 8.1.0
-- Версия PHP: 8.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `chat`
--

-- --------------------------------------------------------

--
-- Структура таблицы `chat_list`
--

CREATE TABLE `chat_list` (
  `id` int NOT NULL,
  `chat_id` int NOT NULL,
  `id1` int NOT NULL,
  `alarm1` tinyint NOT NULL DEFAULT '0',
  `id2` int NOT NULL,
  `alarm2` tinyint NOT NULL DEFAULT '0',
  `lasttime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `chat_list`
--

INSERT INTO `chat_list` (`id`, `chat_id`, `id1`, `alarm1`, `id2`, `alarm2`, `lasttime`) VALUES
(1, 10001, 10001, 0, 10001, 0, ''),
(2, 2, 11, 1, 35, 0, '12:42'),
(3, 3, 11, 0, 40, 0, '17:20'),
(4, 4, 40, 0, 35, 0, '16:55'),
(5, 5, 45, 0, 11, 0, '00:00'),
(6, 6, 45, 0, 40, 0, '00:00'),
(7, 7, 45, 0, 35, 0, '00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int NOT NULL,
  `chat_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message` varchar(255) NOT NULL,
  `time_message` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `chat_id`, `sender_id`, `message`, `time_message`) VALUES
(1, 2, 11, '(ред) Привет пока!', '11:30'),
(2, 2, 35, 'Маракуйя! Какуя маракуйя?', '11:43'),
(3, 2, 11, 'Воу воу воу!!!', '12:31'),
(1, 3, 11, 'Ку ку!', '11:30'),
(2, 3, 35, 'Трам-пам-пам!', '11:43'),
(4, 2, 11, 'Данное сообщение удалено', '15:55'),
(5, 2, 11, '(ред) Привет!', '21:36'),
(6, 2, 35, 'Yoyo!', '19:55'),
(1, 10001, 11, 'Forward->Воу воу воу!!!', '23:11'),
(7, 2, 11, 'Forward->Forward->Воу воу воу!!!', '14:14'),
(2, 10001, 11, 'Всем привет!', '15:44'),
(1, 5, 45, 'Куку!', '15:45'),
(2, 5, 11, 'Хай!', '15:46'),
(3, 5, 11, 'Данное сообщение удалено', '15:48'),
(3, 10001, 35, 'Ау', '16:46');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(249) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `verified` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `resettable` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `roles_mask` int UNSIGNED NOT NULL DEFAULT '0',
  `registered` int UNSIGNED NOT NULL,
  `last_login` int UNSIGNED DEFAULT NULL,
  `force_logout` mediumint UNSIGNED NOT NULL DEFAULT '0',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'avatar-m.png',
  `email_status` tinyint NOT NULL DEFAULT '0',
  `group_status` tinyint NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `username`, `status`, `verified`, `resettable`, `roles_mask`, `registered`, `last_login`, `force_logout`, `avatar`, `email_status`, `group_status`) VALUES
(11, 'oleg.khayrullin@gmail.com', '$2y$10$bvsd78BnXeRfIf.oPdlN6OHFGEOIRdSw4F6lDbQ07pmv1ZNYWo0/i', 'Mad Max', 0, 1, 1, 0, 1686141295, 1687175020, 0, '64901b4dc9f3bavatar-admin-lg.png', 0, 1),
(35, 'hairullin@cg.ru', '$2y$10$oGdf6inq/9GVDnuYknN5keB2qa.s9VTMOq4c1WtM4SaepaBFbqsri', 'Marina', 0, 1, 1, 0, 1686324313, 1687165879, 0, '64901b049d84davatar-j.png', 0, 1),
(40, 'o.khayrullin@yandex.ru', '$2y$10$ZbQPjiZ3KwKP.Hmb6kMqy.0toSu5aNhs31zJ4lUjxhtQ7r581qoG.', 'Harry', 0, 1, 1, 0, 1686682325, 1687165541, 0, '64901a85a1efcavatar-b.png', 1, 0),
(45, 'lvh@inbox.ru', '$2y$10$deiQ7UiiTRD9DxcxfPV7XOUWWa3BMVPekQVTwtvuHJS/aZ6CwTHVy', 'Maria', 0, 1, 1, 0, 1687161251, 1687166212, 0, '64901a39de76eavatar-a.png', 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `users_confirmations`
--

CREATE TABLE `users_confirmations` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `email` varchar(249) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `selector` varchar(16) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `token` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `expires` int UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users_remembered`
--

CREATE TABLE `users_remembered` (
  `id` bigint UNSIGNED NOT NULL,
  `user` int UNSIGNED NOT NULL,
  `selector` varchar(24) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `token` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `expires` int UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users_resets`
--

CREATE TABLE `users_resets` (
  `id` bigint UNSIGNED NOT NULL,
  `user` int UNSIGNED NOT NULL,
  `selector` varchar(20) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `token` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `expires` int UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users_throttling`
--

CREATE TABLE `users_throttling` (
  `bucket` varchar(44) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `tokens` float UNSIGNED NOT NULL,
  `replenished_at` int UNSIGNED NOT NULL,
  `expires_at` int UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users_throttling`
--

INSERT INTO `users_throttling` (`bucket`, `tokens`, `replenished_at`, `expires_at`) VALUES
('QduM75nGblH2CDKFyk0QeukPOwuEVDAUFE54ITnHM38', 64.8248, 1687175020, 1687715020),
('PZ3qJtO_NLbJfRIP-8b4ME4WA3xxc6n9nbCORSffyQ0', 4, 1687161254, 1687593254),
('HIJQJPUQ2qyyTt0Q7_AuZA0pXm27czJnqpJsoA5IFec', 49, 1687161748, 1687233748),
('-Ut0Vp3QCynjpU029BBiV9f2ilTuHcUyvTQCqFe8gEw', 29, 1686198686, 1686270686),
('Ibg_NFrsH6jzP-GLL7a1ecZmCQd_ADQDCKYo2A3iTMA', 29, 1686198686, 1686270686),
('EPoee04nBl0WR6qZ2BJz2zuCc2Lq9hpTPo4w9XQos3Q', 29, 1686324364, 1686396364),
('MMdFuS5yV1mq33gZ-752-rghYL6ZNvFg-uo7EHOtZ6A', 29, 1686324364, 1686396364),
('gWVSRGwfevGmTxRnFYjsBidB4oqBtNEhcs_HmG8u5vQ', 29, 1686683794, 1686755794),
('qAQPCOX4DQwddkFz2pnLRSu_BJoqyiEZf6SQ0jFmAlg', 29, 1686683794, 1686755794),
('U6_zXOezC8I5VXZrjZFH88ykghpWmFUgJUfbfOcyp4g', 29, 1687161748, 1687233748),
('6aivHqjZ78KlpN7tthJQTj4Eok4Wg7DGvVIdMXy6mkQ', 29, 1687161748, 1687233748),
('OMhkmdh1HUEdNPRi-Pe4279tbL5SQ-WMYf551VVvH8U', 19, 1687165642, 1687201642),
('eLXDJgNAMnVU1gafljzKdfbqvT8sAVxJdyRkx2HuM8w', 499, 1687165642, 1687338442);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `chat_list`
--
ALTER TABLE `chat_list`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Индексы таблицы `users_confirmations`
--
ALTER TABLE `users_confirmations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `selector` (`selector`),
  ADD KEY `email_expires` (`email`,`expires`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `users_remembered`
--
ALTER TABLE `users_remembered`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `selector` (`selector`),
  ADD KEY `user` (`user`);

--
-- Индексы таблицы `users_resets`
--
ALTER TABLE `users_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `selector` (`selector`),
  ADD KEY `user_expires` (`user`,`expires`);

--
-- Индексы таблицы `users_throttling`
--
ALTER TABLE `users_throttling`
  ADD PRIMARY KEY (`bucket`),
  ADD KEY `expires_at` (`expires_at`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `chat_list`
--
ALTER TABLE `chat_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT для таблицы `users_confirmations`
--
ALTER TABLE `users_confirmations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT для таблицы `users_remembered`
--
ALTER TABLE `users_remembered`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users_resets`
--
ALTER TABLE `users_resets`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
