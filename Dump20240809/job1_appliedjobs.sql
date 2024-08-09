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
-- Table structure for table `appliedjobs`
--

DROP TABLE IF EXISTS `appliedjobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appliedjobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jobid` int NOT NULL,
  `userid` varchar(36) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `dateofapplied` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appliedjobs`
--

LOCK TABLES `appliedjobs` WRITE;
/*!40000 ALTER TABLE `appliedjobs` DISABLE KEYS */;
INSERT INTO `appliedjobs` VALUES (1,10,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Accepted','2024-07-18 05:39:28'),(2,101,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Accepted','2024-07-18 05:39:38'),(3,112,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Pending','2024-07-18 05:49:40'),(4,111,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Pending','2024-07-18 06:08:59'),(5,10,'5f1a9da5-b9ac-4e5a-9ce6-002d23125b21','Rejected','2024-07-18 07:22:26'),(6,114,'5f1a9da5-b9ac-4e5a-9ce6-002d23125b21','Accepted','2024-07-18 07:22:41'),(7,115,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Pending','2024-07-19 05:09:49'),(8,201,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Pending','2024-07-19 05:16:12'),(9,101,'5fb61c9b-76f4-4124-b1de-6c065b0ab71c','Rejected','2024-07-22 08:43:23'),(10,11,'5fb61c9b-76f4-4124-b1de-6c065b0ab71c','Accepted','2024-07-22 08:43:29'),(11,114,'5fb61c9b-76f4-4124-b1de-6c065b0ab71c','Rejected','2024-07-22 08:43:33'),(12,101,'e54287d9-6ece-4bf2-87eb-6bbf8ee629a4','Accepted','2024-07-23 08:39:26'),(13,11,'d3e742df-f373-4c83-ad29-2aac29ff53de','Pending','2024-07-23 09:46:58'),(14,2,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Pending','2024-07-24 04:48:52'),(15,118,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Pending','2024-07-24 04:49:42'),(16,116,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Pending','2024-07-24 06:10:17'),(18,101,'f7fed022-46a1-46ec-8140-5801cf69e3b5','Pending','2024-07-25 04:36:02'),(19,3,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Pending','2024-07-25 12:41:28');
/*!40000 ALTER TABLE `appliedjobs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-09 14:16:18
