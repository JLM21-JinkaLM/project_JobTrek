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
-- Table structure for table `job_details`
--

DROP TABLE IF EXISTS `job_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_details` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `salary` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `dateOfPost` date NOT NULL,
  `lastDate` date NOT NULL,
  `skills_id` varchar(255) DEFAULT NULL,
  `experience` varchar(255) NOT NULL,
  `jobtype` varchar(255) NOT NULL,
  `location_id` int DEFAULT NULL,
  `education` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `skills_id` (`skills_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `job_details_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `job_details_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_details`
--

LOCK TABLES `job_details` WRITE;
/*!40000 ALTER TABLE `job_details` DISABLE KEYS */;
INSERT INTO `job_details` VALUES ('4a4d0140-77ea-4268-b34f-afb51cc7dba6','man','man','9',21,'2024-08-01','2024-08-31','13','0-1','Full-Time',4,'B.Com'),('4c8094ce-c807-4f5d-af32-bbb17bf93f8e','q','q','3',21,'2024-08-01','2024-08-15','61e6644a-7066-4d4c-935b-5f545dffed51','0-1','Full-Time',1,'B.Tech'),('88899959-f575-4aa5-be27-289fe9835e55','h','g','3',25,'2024-08-01','2024-09-06','33d38a88-0dab-4520-9cf6-255974c3a46d','0-1','Full-Time',4,'B.Tech'),('928d4fb4-7e6f-4693-b5ff-7f7e6159cadf','a','a','3',28,'2024-08-01','2024-08-30','7628e78e-49f6-48fe-baa2-bcb51719a9bb','1-2','Full-Time',4,'B.Com'),('d0e502a8-9277-4b85-9c00-a4445e70ef91','1','1','1',28,'2024-08-01','2024-08-29','7,11,12','0-1','Full-Time',2,'B.Tech'),('f92472b0-4351-49e7-95a6-2848d3e9bb2c','c','c','3',26,'2024-08-01','2024-08-22','a9d287c0-d154-456c-b1e4-53245f0eaec5','0-1','Full-Time',1,'B.Tech');
/*!40000 ALTER TABLE `job_details` ENABLE KEYS */;
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
