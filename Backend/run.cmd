@echo off
title Employee Management System - Spring Boot Backend
cd /d "%~dp0"
echo ========================================================
echo Starting EMS Spring Boot Backend (Embedded Tomcat 8080)
echo ========================================================
call "%~dp0.maven\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
pause
