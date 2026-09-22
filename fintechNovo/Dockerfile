# ==========================================
# ESTÁGIO 1: Build (Construção)
# ==========================================
# Usamos uma imagem com Maven e Java 21 para compilar o código
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /build

# Copia o arquivo pom.xml e baixa as dependências (otimiza o tempo de deploy no Render)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia todo o código-fonte (incluindo a pasta da wallet)
COPY src ./src

# Compila o projeto e gera o arquivo .jar (ignorando testes para acelerar o processo)
RUN mvn clean package -DskipTests

# ==========================================
# ESTÁGIO 2: Run (Execução)
# ==========================================
# Usamos uma imagem mais leve apenas com o Java (sem o Maven) para rodar a aplicação
FROM eclipse-temurin:21-jre
WORKDIR /app

# Traz o arquivo .jar gerado no Estágio 1
COPY --from=builder /build/target/*.jar app.jar

# Traz a pasta física da wallet para o servidor Linux
COPY --from=builder /build/src/main/resources/wallet /app/wallet

# Informa ao Render qual porta a aplicação vai usar
EXPOSE 8080

# Comando que liga o servidor Spring Boot
CMD ["java", "-jar", "app.jar"]