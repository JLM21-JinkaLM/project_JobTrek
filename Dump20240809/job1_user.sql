-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: job1
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `username` text NOT NULL,
  `email` text,
  `password` text,
  `user_role` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('0c021d0d-8ed0-4711-b382-155c972a2ff1','bhumika','bhumika@gmail.com','$2a$10$WfThhzfpqWq/ftP.ZInIAe0w8.qNKvHFPniDAadsn7111sKiXUsie',NULL,'2024-06-18 12:28:23'),('0c13f600-eff9-4b90-a1a4-80052dfa1b20','gamma','gamma1@gmail.com','$2a$10$iV08PsCPI7JfFVx//bsfDOrR3pBcOlkMhb.n79UrlbE90QoN3njQa','user','2024-06-18 17:30:00'),('0d4eeec7-540e-4dcb-af3f-552ab95a8ef3','adminsad','sad@gmail.com','$2a$10$E4GMjydd4RgmWPcUOlYequDes2Fmh5aJERWLky7/8G.baZBLDbxT6','user','2024-06-19 12:15:30'),('0fa676d7-123c-4972-9472-fa36da3d053e','king','king1@gmail.com','$2a$10$qfA2jEj9w3dlKw/JTGpGBu/VTTzLEphq4imqQpwDywBD1ca4PwW26',NULL,'2024-06-18 16:00:16'),('0fd6ada5-7c4b-49ef-9780-7a4fbd91e860','page','page@gmail.com','$2a$10$xYxBpleVThkDEd9/bDMWzOm2lRV3qYaQC4JUX4y4HT6Qn4ZwG8RrS','user','2024-07-24 11:33:00'),('1663363a-03a7-4d1c-8ac3-5b27a0207005','abcb','abcb@gmail.com','$2a$10$AAHBDf/gls8u04I0UMeO3uQWOoRmv6E96Oi.Rkxgv.jgDcd3IMLI2',NULL,'2024-06-18 12:53:47'),('168d4637-8b83-427b-b2e0-40a724481c05','eeee','admin@gmail.com','$2a$10$KnxzUyxvufpV0vPXhLKniuhVbwyLqjsoMKcE69z0vvrHu7cuCWWJm',NULL,'2024-06-18 11:47:36'),('18d6d435-a603-4d90-ab87-6caf0b98fdfb','adam','adam@gmail.com','$2a$10$vEEgR8HGE1Ockci4/.h8qubncJ0ZS3F.UgEhzDUsVNGfh4dvZoyeK','admin','2024-06-18 17:00:17'),('20806be7-3a72-4e24-847c-da8c3f9ff7f0','raghu','raghu@gmail.com','$2a$10$1Rlu1r3cBcOSWynQsXsts.a.amfRmiS2qAAXKIfc8ieRwXJdQQwOu','user','2024-07-23 14:36:47'),('23a83fbc-269d-4252-aef9-b3429fd955f7','user321r','admin123@purpledata.com','$2a$10$9ZCPkxZIUH7ESFgSfyjiy.7vqgMs2XeGd8Xw4r6cpOLX4CV/aUHFG',NULL,'2024-06-18 15:19:25'),('2ec0ebf8-c047-4934-938d-bb331df3e2cc','jlma','jlm@gmail.com','$2a$10$6oUTT/bG13LykR8P7N9pM.ai9OTfDHySZfqCzy6QpPCQn0RMt2zry',NULL,'2024-06-15 17:44:41'),('35a25941-335c-4f2e-b7c6-f9eaba78e63a','yuyggg','admin@purpledata.com','$2a$10$aXVSkmT3eTbwNzKgo8oUu.FwzQk/pbblxziu7dha3K3jm1jHKyGCG',NULL,'2024-06-18 11:24:42'),('3d1c7e46-7a2c-4fdc-9755-c924df2359c7','user','user@gmail.com','$2a$10$WqNTzTnTxqHJ8d7q7crvw.CSAtQTSSwPjPba7MqQjfRdtMJt4QmL6',NULL,'2024-06-18 14:22:19'),('3f5b307d-4e79-4b03-81c2-01ba1b534a1d','krishna','krishna@gmail.com','$2a$10$j6KoOM.vPe6Uo4wMzFlvHuhFffPNRrfjtYOBz9n3/.zQp4j/.DVGi',NULL,'2024-06-18 16:20:00'),('43abefed-54dd-4446-a501-2ebea4b72fd2','wwww','admin@purplata.com','$2a$10$ycB.eDI4IRFj5EERFu5nr.iOdHEwuK2sHOPAtbjGu7fp1hk2nzFtW',NULL,'2024-06-18 13:57:04'),('4af06661-feef-46a0-a507-58b922326b4f','user321rsdfsdf','adminsdf@purpledata.com','$2a$10$Gmg.q4vzQVtQnlMsCw7KZuVlcyzH.E9s135twYvww4aSrpDm0IlDG',NULL,'2024-06-18 15:24:07'),('4c537ed2-1c7a-45f7-bb0f-8b331cc4f5cb','asdaddf','asdafa@purpledata.com','$2a$10$qEmfbDxLif8jMUMiKKhI8uKJkoio6oe9TkPvijrmwezF.Zk3FGZ2u',NULL,'2024-06-18 12:44:46'),('52731578-e995-46f6-824f-e40b2185a046','abcd','abcd@purpledata.com','$2a$10$.Hw6hxBKKqvEcOZ6srVjzOKZijHo1L9DqjiDXKMdaWsM45tFE0Qu6',NULL,'2024-06-18 12:32:23'),('553de328-439a-4c48-b156-012e02428376','jlmaneesha','manee123@gmail.com','$2a$10$hFUdwK35sDFdVNF79al.1OSlMI/7BJ5Xg3heCZoDfr/X8shgH9rTu',NULL,'2024-06-18 11:31:39'),('593e3c85-25e3-4706-91b6-9f3cb0651e21','jlsm','jlsm@gmail.com','$2a$10$GWRMcLzIhqUjcmcfNvSYw.aEINCwtfr83FIHrKOe4QxQKZy2AxsH.',NULL,'2024-06-18 11:01:25'),('5cd90116-b1cc-4eb6-9770-7664e62dc2aa','user321r','king@gmail.com','$2a$10$U0eJHaHfbRsHN8OYhWNIN.J4oKeExT9UhtYCKMAlc99Q9NGwThcPm',NULL,'2024-06-18 15:59:32'),('5d3ba0c2-7312-4e7c-9b74-5f4f0123852b','radha','radha@gmail.com','$2a$10$3aZ7sxrNmsLlc4mNy.0x6eC5IuHclPkbogt7T6btzC4Tu8MXqY2oe',NULL,'2024-06-18 16:19:20'),('5f1a9da5-b9ac-4e5a-9ce6-002d23125b21','JLManeesha','jinka359595@gmail.com','$2a$10$jyRmE3jsYgQLtZd0pn1VxeGIw1qtccNJ7HvBtpk7hYRcl/KO0ue3i','user','2024-07-11 14:46:31'),('5fb61c9b-76f4-4124-b1de-6c065b0ab71c','radha','radha123@gmail.com','$2a$10$250vdBMWYHHm0.GqMI6t7OOLFU42Fgy6L0H5aJtelC54kdc1WyZia','user','2024-07-22 14:12:59'),('621cf56e-08b2-4c72-b2c2-cc895cd836dc','asdk','a@gmail.com','$2a$10$R1C2UWSKcLG2vTmG03Q6ROxjhQ73CrYhjoQBDAw5vFjlXqof1oqb.',NULL,'2024-06-18 11:59:37'),('649bb72e-95b7-4c26-8b69-f986019ddb3e','vcvc','vcvc@gmail.com','$2a$10$Ke/20P7xPlA3jDtKHq/ou.5FXVeZ4UpXH4GY8xvski9irh6dvIkj6',NULL,'2024-06-18 12:23:03'),('75f69d2a-65cb-4d32-b073-badcf30fa992','aaaa','aaaa@gmail.com','$2a$10$8rP6s24zM3SwbyQ3V1RmkOxR5v/Oaffm1G.q5t2z8XIxY.cyRZXv.',NULL,'2024-06-18 13:04:39'),('7b986ffc-5699-4d68-a058-e6257d71e648','names','fgf@gmail.com','$2a$10$DY.BV.vJ6UpmP7XK9rM9Be2ieUhwRY0Zzah7zaGa3N0nTxdQLrfKu',NULL,'2024-06-18 11:48:52'),('7e3cb179-9db6-4047-97a1-77efd50a5a07','wwwwwwwwwww','adminww@purpledata.com','$2a$10$O4f3V69boIcqU5dz.GoTCeR9w94g/Z8EZOibHGpdZw/CHSi0Ly/uW',NULL,'2024-06-18 11:25:19'),('7e6e386d-4530-431f-960d-8f1d7cb575fa','users','users@gmail.com','$2a$10$JKK9yQHLKH08M.voH/enWOfO6xDeS7LUz4/x6Mfcg5AHl1nSluAqK',NULL,'2024-06-18 14:43:04'),('7ead81c0-89a4-4cd4-aa28-2caa1d11e5b7','purple','purple123@gmail.com','$2a$10$Y2OohClAtlNqkAcZER1xCeJ.do.G7aHPUOjDFAooAywLYc4WjwEfe','user','2024-07-23 14:59:55'),('86e4164c-b749-494e-ba12-88ef3181422a','bbbb','bbbb@gmail.com','$2a$10$mC9ziyEKX14bfS0ikLd/pORRacYxvXtSgKgj0ZH6gfoYDL3K2xSMW',NULL,'2024-06-18 13:01:31'),('86e4ffff-3b00-495b-a34b-c3b254f26cd2','wewe','wewe@gmail.com','$2a$10$v64Z3zrU3KsijvyfjJl6weZl4U/DXQRojhDE3A9jebB8JRRX9BWoK',NULL,'2024-06-18 12:17:06'),('8c115762-087f-43db-a284-fa7c66cc76ee','user321rf','admin3@purpledata.com','$2a$10$i/NsGnaWKkGXxIvNKjENKuJQp6m3AnRMhNjeZ3vHfpFPM4SOJeGQK',NULL,'2024-06-18 15:20:34'),('8f78312d-ec95-4d0b-afd0-1326879dedfb','user123','maneeshajl21@gmail.com','$2a$10$EtfOOgfGsk8gLqDnMuBe3OOaZ8Bx8ifGUDcCj.IR6r8lPhOBW4GKK',NULL,'2024-06-18 15:03:29'),('98cb4380-80eb-445a-9c5d-3da6e72f37fd','asha','asha@gmail.com','$2a$10$C32pklWb1Obu/LvBtc.53u2mSacEY2G2UWc5wOQt2/QaXVLGlrPqW','user','2024-07-25 10:16:03'),('a7c735e8-3b40-4283-9e10-568ca20fd3e3','adfasdfd','abc@gmail.com','$2a$10$jtuf01ADXTxowVkjuufxwOyxopIfGi2PVO3g7qZm7kziAzQfomVsi',NULL,'2024-06-18 12:43:29'),('afcf12c9-a43b-4f97-915a-1206a566e416','qwer','qwer@gmail.com','$2a$10$spnTHRJ.UUNxjkWRIjV/dOpeJXc.QjgSDZD6esJRLK.0WzcC2r.4.',NULL,'2024-06-18 11:51:32'),('b2154636-8ff1-40a4-8770-d05105238821','jinka','jinka@gmail.com','$2a$10$yx5TH8DTaRysvE8ujEkmvONKIevjhtSNvl4wNiQYLvvoMBS9HxxD6',NULL,'2024-06-18 14:04:41'),('b60275a9-20ea-4253-8e30-c5b866697a0f','dfff','teaaa@gmail.com','$2a$10$EJoLRmW4Y35FZjQCHwzUBuEfS0md.y2Rdh4/8EQhllxAZTnZLS3WS',NULL,'2024-06-18 11:40:49'),('b84e9f8d-365d-43ec-a551-b7c44a2256f7','lakhan','lakhan@gmail.com','$2a$10$DltfzMj367hu4T6s8.c2d.p.nJ7uerIhhkeNWgGUGrlBkOnE0Zr/W',NULL,'2024-06-18 14:37:25'),('c75b80fd-ce17-4335-8639-416c6665cd5e','xcxc','xcxc@gmail.com','$2a$10$ZCVvOm6zM29BZ82xxhidOOKy4kx/11a28qos1iC.l5tRGv.ZpdUeW',NULL,'2024-06-18 12:20:31'),('cbf66bae-32c8-4b62-8cd1-257ccec2e1f0','bhumika','bhumika@gamil.com','$2a$10$u1Ra7c80TVIljfBGK8JJ6OKFHFWhRfsnXfjQnUI2vcNb6pGOSMk6i',NULL,'2024-06-18 12:26:44'),('cdefea81-2329-4f26-9a0d-0c4692f8ba59','ffff','ffff@gmail.com','$2a$10$SbnXR3CfGoUsFngB4NtW8u0Aiyd/2aUIQB43yvuF.agI91QSajci2',NULL,'2024-06-18 12:24:52'),('d3e742df-f373-4c83-ad29-2aac29ff53de','pink','pink123@gmail.com','$2a$10$WWCN84XxxRv2vqdRGzI7wuUtYW6RnvfJH0sz81pkIcASKG6g3yEPu','user','2024-07-23 15:15:30'),('d4697217-1b7a-422d-8e48-3c2e57b419e8','sdss','sdss@gmail.com','$2a$10$GHeRjeXaOwjZeOXgWtT7BeONoz0..1enaKt4MeTantxE0gVne.MOK',NULL,'2024-06-18 12:19:57'),('e54287d9-6ece-4bf2-87eb-6bbf8ee629a4','krishna','krish123@gmail.com','$2a$10$8ZSrmHXrZcHQ8c3Bm3YRXug3dT8jZCvjcN3Q4JRikfJz8O7zGUX4O','user','2024-07-23 12:38:18'),('e82b23e7-cfd5-4048-b86d-7ee3de0a7e4b','were','were@gmail.com','$2a$10$Rzn4iXHSKn8VIMK80q.4jeb2MBhfucltKNIfnIQ5kKC/W4WaxKGM2',NULL,'2024-06-18 12:11:48'),('f445e589-7d8d-4b18-a16c-9af8aef1ce5c','gamma','gamma@gmail.com','$2a$10$hOSqiz4bnbhiKSWj0/F5/eIEjtpd8Bvz4fUEkfdPGhvc1CyGuNdQu','user','2024-06-18 17:29:35'),('f7fed022-46a1-46ec-8140-5801cf69e3b5','gate','gate@gmail.com','$2a$10$Ogd7EVVhhSGcUcPDmU80Te.WjVGaf8Xe5HvaivpQNkXdHtcqtmkGK','user','2024-07-25 10:05:21'),('ff221a48-ee9c-41ef-96ef-faba68cd1570','names','names@gmail.com','$2a$10$R6PfDcXJV/4KbM.rmZ6we.HuKTOMeXk/Xud8rCVIJIZCivYfNw5re',NULL,'2024-06-18 16:38:59');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-09 14:16:21
