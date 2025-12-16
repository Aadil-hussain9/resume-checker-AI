FROM eclipse-temurin:17-jre

WORKDIR /app
EXPOSE 8001

# Copy Gradle-built JAR
COPY build/libs/*.jar app.jar

# Copy resources (if really needed at runtime)
COPY src/main/resources/en-token.bin /app/src/main/resources/en-token.bin
COPY src/main/resources/en-pos-maxent.bin /app/src/main/resources/en-pos-maxent.bin
COPY src/main/resources/stopwords.txt /app/src/main/resources/stopwords.txt

ENTRYPOINT ["java","-jar","app.jar"]
