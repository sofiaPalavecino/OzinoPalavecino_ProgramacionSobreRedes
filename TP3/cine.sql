-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cine
-- ------------------------------------------------------
-- Server version	5.7.28-log

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
-- Table structure for table `funciones`
--

DROP TABLE IF EXISTS `funciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) NOT NULL,
  `fecha` datetime NOT NULL,
  `sala` int(11) NOT NULL,
  `butacas_disponibles` json NOT NULL,
  `vigente` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funciones`
--

LOCK TABLES `funciones` WRITE;
/*!40000 ALTER TABLE `funciones` DISABLE KEYS */;
INSERT INTO `funciones` VALUES (1,'Ciudadano Kane','2020-04-13 19:30:00',1,'[\"a1\", \"a4\", \"b2\", \"c1\"]',0),(3,'El Padrino','2020-07-24 21:00:00',2,'[]',0),(4,'Lo que el viento se llevó','2021-08-01 15:45:00',1,'[\"a3\", \"a4\", \"b1\", \"b2\", \"b3\", \"b4\", \"c2\", \"c3\", \"c4\", \"d1\", \"d2\", \"d3\", \"f1\"]',1);
/*!40000 ALTER TABLE `funciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` int(11) NOT NULL,
  `funcion` int(11) NOT NULL,
  `butacas_reservadas` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reserva_usuario_idx` (`usuario`),
  CONSTRAINT `reserva_usuario` FOREIGN KEY (`usuario`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (1,3,1,'[\"a2\", \"a3\"]'),(2,1,1,'[\"a5\", \"a6\", \"b1\"]'),(3,2,1,'[\"b3\", \"b4\", \"b5\", \"b6\"]'),(4,6,1,'[\"c2\", \"c3\", \"c4\", \"d1\", \"d2\", \"d3\"]'),(5,2,1,'[\"e1\", \"e2\", \"f1\"]'),(6,5,2,'[\"a1\", \"a2\", \"a3\", \"a4\", \"b1\", \"b2\"]'),(7,4,2,'[\"b3\", \"b4\", \"c1\", \"c2\", \"c3\", \"c4\"]'),(8,2,2,'[\"d1\", \"d2\", \"d3\", \"d4\", \"e1\", \"e2\"]'),(9,6,2,'[\"e3\", \"e4\", \"f1\", \"f2\", \"f3\", \"f4\"]'),(10,1,3,'[\"a1\", \"a2\"]'),(11,4,3,'[\"a5\", \"a6\"]'),(12,2,3,'[\"b5\", \"b6\"]'),(13,3,3,'[\"b1\"]'),(14,6,3,'[\"e1\", \"e2\"]');
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salas`
--

DROP TABLE IF EXISTS `salas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `butacas` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salas`
--

LOCK TABLES `salas` WRITE;
/*!40000 ALTER TABLE `salas` DISABLE KEYS */;
INSERT INTO `salas` VALUES (1,'triangular','[\"a1\", \"a2\", \"a3\", \"a4\", \"a5\", \"a6\", \"b1\", \"b2\", \"b3\", \"b4\", \"b5\", \"b6\", \"c1\", \"c2\", \"c3\", \"c4\", \"d1\", \"d2\", \"d3\", \"e1\", \"e2\", \"f1\"]'),(2,'cuadrada','[\"a1\", \"a2\", \"a3\", \"a4\", \"b1\", \"b2\", \"b3\", \"b4\", \"c1\", \"c2\", \"c3\", \"c4\", \"d1\", \"d2\", \"d3\", \"d4\", \"e1\", \"e2\", \"e3\", \"e4\", \"f1\", \"f2\", \"f3\", \"f4\"]');
/*!40000 ALTER TABLE `salas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'johnconnor'),(2,'lukeskywalker'),(3,'brucewayne'),(4,'harrypotter'),(5,'johnmclane'),(6,'frodobaggins');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-22 13:08:18
