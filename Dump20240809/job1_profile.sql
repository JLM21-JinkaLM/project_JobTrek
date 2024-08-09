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
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile` (
  `profileId` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `education` varchar(100) DEFAULT NULL,
  `skills` text,
  `description` text,
  PRIMARY KEY (`profileId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` VALUES (1,'35a25941-335c-4f2e-b7c6-f9eaba78e63a','Jinka lakshmi Maneesha ','admin@purpledata.com','+918555827546','Male','Proddatur','India','B.Tech','html','here'),(2,'5f1a9da5-b9ac-4e5a-9ce6-002d23125b21','jinkalskhmi','jinka359595@gmail.com','9000801725','Female','KADAPA','India','B.Tech','aa','idk'),(3,'5fb61c9b-76f4-4124-b1de-6c065b0ab71c','radha','radha123@gmail.com','9390311315','Female','KADAPA','India','B.Tech','d','reer'),(4,'e54287d9-6ece-4bf2-87eb-6bbf8ee629a4','krishna','krish123@gmail.com','9000801725','Male','Proddatur','India','B.Tech','d','s'),(5,'20806be7-3a72-4e24-847c-da8c3f9ff7f0','Raghuvarun','raghu@gmail.com','9100209205','Male','Proddatur','India','B.Tech','html','yes'),(6,'7ead81c0-89a4-4cd4-aa28-2caa1d11e5b7','Purple','purple123@gmail.com','9000801725','Male','Proddatur','India','B.Tech','aa','e'),(7,'d3e742df-f373-4c83-ad29-2aac29ff53de','Pinky','pink123@gmail.com','+918555827546','Male','Proddatur','India','B.Tech','a','i am human');
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-09 14:16:20
