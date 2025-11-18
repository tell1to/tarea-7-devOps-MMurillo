# 🚀 Ciclo CI/CD: Implementación Completa hasta Package

## 📋 Tabla de Contenidos
- [Introducción al CI/CD](#introducción-al-cicd)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración del Pipeline](#configuración-del-pipeline)
- [Pruebas Unitarias](#pruebas-unitarias)
- [Construcción del Package](#construcción-del-package)
- [Verificación del Pipeline](#verificación-del-pipeline)
- [Resultados y Artefactos](#resultados-y-artefactos)

## 🔄 Introducción al CI/CD

**CI/CD** (Integración Continua/Entrega Continua) es una práctica fundamental en el desarrollo de software moderno que permite automatizar el proceso de construcción, prueba y despliegue de aplicaciones.

### Componentes del Ciclo CI/CD

1. **CI (Integración Continua)**
   - Integración frecuente de código
   - Ejecución automática de pruebas
   - Construcción automática
   - Detección temprana de errores

2. **CD (Entrega Continua)**
   - Empaquetado automatizado
   - Preparación para despliegue
   - Liberación de versiones
   - Garantía de calidad

## 🏗️ Estructura del Proyecto

### Arquitectura de Archivos
```
mi-proyecto-ci-cd/
├── .github/
│   └── workflows/
│       └── ci-cd-pipeline.yml
├── src/
│   ├── math.js
│   └── app.js
├── tests/
│   └── math.test.js
├── scripts/
│   └── verify-package.js
├── package.json
└── README.md
```

### 📁 Archivos del Proyecto

#### 1. `src/math.js` - Módulo Principal
```javascript
// Operaciones matemáticas básicas
function sumar(a, b) {
    return a + b;
}

function restar(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {
    if (b === 0) {
        throw new Error('División por cero no permitida');
    }
    return a / b;
}

module.exports = { sumar, restar, multiplicar, dividir };
```

#### 2. `src/app.js` - Aplicación Principal
```javascript
const { sumar, restar, multiplicar, dividir } = require('./math');

console.log('🔢 Calculadora CI/CD');
console.log('===================');
console.log(`Suma: 5 + 3 = ${sumar(5, 3)}`);
console.log(`Resta: 10 - 4 = ${restar(10, 4)}`);
console.log(`Multiplicación: 6 * 7 = ${multiplicar(6, 7)}`);
console.log(`División: 15 / 3 = ${dividir(15, 3)}`);

module.exports = { sumar, restar, multiplicar, dividir };
```

#### 3. `tests/math.test.js` - Pruebas Unitarias
```javascript
const { sumar, restar, multiplicar, dividir } = require('../src/math');

describe('Operaciones Matemáticas', () => {
    test('Suma correctamente dos números', () => {
        expect(sumar(2, 3)).toBe(5);
        expect(sumar(-1, 1)).toBe(0);
    });

    test('Resta correctamente dos números', () => {
        expect(restar(5, 3)).toBe(2);
        expect(restar(10, 15)).toBe(-5);
    });

    test('Multiplica correctamente dos números', () => {
        expect(multiplicar(4, 3)).toBe(12);
        expect(multiplicar(7, 0)).toBe(0);
    });

    test('Divide correctamente dos números', () => {
        expect(dividir(10, 2)).toBe(5);
        expect(dividir(9, 3)).toBe(3);
    });

    test('Lanza error al dividir por cero', () => {
        expect(() => dividir(5, 0)).toThrow('División por cero no permitida');
    });
});
```

#### 4. `package.json` - Configuración del Proyecto
```json
{
    "name": "mi-proyecto-ci-cd",
    "version": "1.0.0",
    "description": "Ejemplo práctico de CI/CD con Node.js",
    "main": "src/app.js",
    "scripts": {
        "test": "jest",
        "test:coverage": "jest --coverage",
        "build": "node src/app.js",
        "package": "npm pack",
        "verify-package": "node scripts/verify-package.js"
    },
    "devDependencies": {
        "jest": "^29.0.0"
    },
    "keywords": ["ci-cd", "github-actions", "nodejs", "automation"],
    "author": "Tu Nombre",
    "license": "MIT"
}
```

#### 5. `scripts/verify-package.js` - Verificación de Package
```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function verifyPackage() {
    console.log('🔍 Iniciando verificación del package...');
    
    const files = fs.readdirSync('.');
    const packageFile = files.find(file => file.endsWith('.tgz'));
    
    if (!packageFile) {
        console.error('❌ No se encontró ningún archivo .tgz');
        process.exit(1);
    }
    
    console.log(`✅ Package encontrado: ${packageFile}`);
    
    const stats = fs.statSync(packageFile);
    console.log(`📏 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    
    const tempDir = 'temp-verify';
    try {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
        }
        fs.mkdirSync(tempDir);
        
        execSync(`tar -xzf ${packageFile} -C ${tempDir}`);
        
        const packageDir = path.join(tempDir, 'package');
        
        const essentialFiles = [
            'package.json',
            'src/math.js',
            'src/app.js'
        ];
        
        console.log('📁 Verificando archivos esenciales:');
        essentialFiles.forEach(file => {
            const filePath = path.join(packageDir, file);
            if (fs.existsSync(filePath)) {
                console.log(`   ✅ ${file}`);
            } else {
                console.log(`   ❌ ${file} - NO ENCONTRADO`);
                process.exit(1);
            }
        });
        
        const packageJsonPath = path.join(packageDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        console.log('📋 Información del package.json:');
        console.log(`   Name: ${packageJson.name}`);
        console.log(`   Version: ${packageJson.version}`);
        console.log(`   Main: ${packageJson.main}`);
        
        console.log('🎉 ¡Package verificado exitosamente!');
        
    } catch (error) {
        console.error('❌ Error durante la verificación:', error.message);
        process.exit(1);
    } finally {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
        }
    }
}

verifyPackage();
```

## ⚙️ Configuración del Pipeline

### `.github/workflows/ci-cd-pipeline.yml`

```yaml
name: CI/CD Pipeline - Build and Package

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # Job de pruebas unitarias
  test:
    name: Ejecutar Pruebas Unitarias
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout del código
      uses: actions/checkout@v4
      
    - name: Configurar Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Instalar dependencias
      run: npm ci
      
    - name: Ejecutar pruebas unitarias
      run: npm test
      
    - name: Generar reporte de cobertura
      run: npm run test:coverage
      
    - name: Subir reporte de cobertura
      uses: actions/upload-artifact@v4
      with:
        name: coverage-report
        path: coverage/
        retention-days: 30

  # Job de construcción y empaquetado
  build:
    name: Construir y Empaquetar
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - name: Checkout del código
      uses: actions/checkout@v4
      
    - name: Configurar Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Instalar dependencias
      run: npm ci
      
    - name: Verificar calidad de código
      run: |
        echo "🔍 Verificando sintaxis del código..."
        node -c src/math.js
        node -c src/app.js
        echo "✅ Sintaxis verificada correctamente"
        
    - name: Construir la aplicación
      run: npm run build
      
    - name: Crear package
      run: npm run package
      
    - name: Verificar package generado
      run: |
        echo "📦 Verificando package..."
        PACKAGE_FILE=$(ls *.tgz)
        echo "Package encontrado: $PACKAGE_FILE"
        
        if [ -f "$PACKAGE_FILE" ]; then
          echo "✅ Package creado exitosamente"
          echo "📊 Información del package:"
          tar -tzf "$PACKAGE_FILE" | head -10
          echo "📏 Tamaño del package:"
          ls -lh "$PACKAGE_FILE"
        else
          echo "❌ Error: No se encontró el package"
          exit 1
        fi
        
    - name: Validar contenido del package
      run: |
        PACKAGE_FILE=$(ls *.tgz)
        echo "🔍 Validando contenido del package..."
        
        mkdir -p temp-package
        tar -xzf "$PACKAGE_FILE" -C temp-package
        cd temp-package/package
        
        echo "📁 Estructura del package:"
        find . -type f -name "*.js" | head -10
        
        echo "📋 package.json contenido:"
        cat package.json
        
        if [ -f "src/math.js" ] && [ -f "src/app.js" ]; then
          echo "✅ Archivos principales presentes"
        else
          echo "❌ Faltan archivos principales"
          exit 1
        fi
        
    - name: Verificación avanzada del package
      run: npm run verify-package
      
    - name: Subir artefacto (package)
      uses: actions/upload-artifact@v4
      with:
        name: application-package
        path: '*.tgz'
        retention-days: 30

  # Job de análisis de seguridad
  security:
    name: Análisis de Seguridad
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout del código
      uses: actions/checkout@v4
      
    - name: Análisis de seguridad con CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: javascript
        
    - name: Autobuild
      uses: github/codeql-action/autobuild@v3
      
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
```

## 🧪 Pruebas Unitarias

### Ejecución y Resultados Esperados

```bash
# Ejecutar pruebas localmente
npm test

# Ejecutar pruebas con cobertura
npm run test:coverage
```

### Salida Esperada
```
PASS  tests/math.test.js
  Operaciones Matemáticas
    ✓ Suma correctamente dos números (2 ms)
    ✓ Resta correctamente dos números
    ✓ Multiplica correctamente dos números
    ✓ Divide correctamente dos números (1 ms)
    ✓ Lanza error al dividir por cero (1 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.234 s
Ran all test suites.
```

### Cobertura de Código
El pipeline genera un reporte de cobertura que incluye:
- ✅ Porcentaje de líneas cubiertas
- ✅ Porcentaje de funciones cubiertas
- ✅ Porcentaje de branches cubiertas
- 📊 Reporte HTML detallado

## 📦 Construcción del Package

### Proceso de Empaquetado

1. **Verificación de Sintaxis**
   - Validación de archivos JavaScript
   - Detección de errores de sintaxis

2. **Construcción de la Aplicación**
   - Ejecución del script de build
   - Verificación de funcionalidad

3. **Generación del Package**
   - Creación del archivo `.tgz` con `npm pack`
   - Inclusión de todos los archivos necesarios

4. **Validación del Package**
   - Verificación de estructura
   - Confirmación de archivos esenciales
   - Validación de metadatos

### Estructura del Package Generado
```
mi-proyecto-ci-cd-1.0.0.tgz
└── package/
    ├── package.json
    ├── src/
    │   ├── math.js
    │   └── app.js
    ├── tests/
    │   └── math.test.js
    └── scripts/
        └── verify-package.js
```

## 🔍 Verificación del Pipeline

### Cómo Verificar que el Pipeline Funciona

#### 1. **En la Interfaz de GitHub Actions**
- Ir a la pestaña "Actions"
- Seleccionar el workflow ejecutado
- Verificar que todos los jobs están en verde ✅

#### 2. **Verificación de Artifacts**
- Buscar la sección "Artifacts" en el workflow
- Descargar "application-package"
- Verificar el archivo `.tgz`

#### 3. **Comandos de Verificación Local**
```bash
# Descargar y verificar el artifact
unzip application-package.zip
tar -tzf mi-proyecto-ci-cd-1.0.0.tgz

# Probar el package extraído
tar -xzf mi-proyecto-ci-cd-1.0.0.tgz
cd package
npm test
```

### Indicadores de Éxito

- ✅ **Job test**: Pruebas pasando
- ✅ **Job build**: Package generado y verificado
- ✅ **Job security**: Análisis completado
- 📦 **Artifact**: application-package disponible
- 📊 **Coverage**: Reporte de cobertura generado

## 🎯 Resultados y Artefactos

### Artefactos Generados

1. **application-package**
   - Archivo: `mi-proyecto-ci-cd-1.0.0.tgz`
   - Contenido: Código fuente empaquetado
   - Retención: 30 días

2. **coverage-report**
   - Archivos: Reporte HTML/JSON de cobertura
   - Métricas: Porcentajes de cobertura
   - Retención: 30 días

### Métricas de Calidad

- **Cobertura de pruebas**: 100% (en este ejemplo)
- **Código verificado**: Sin errores de sintaxis
- **Seguridad**: Análisis estático completado
- **Package**: Estructura validada

## 🚀 Comandos para Ejecución Local

```bash
# Instalación y configuración inicial
npm install

# Ejecutar el flujo completo manualmente
npm test
npm run build
npm run package
npm run verify-package

# Verificación rápida
ls -la *.tgz
tar -tzf mi-proyecto-ci-cd-1.0.0.tgz | head -10
```

## 📈 Mejoras Futuras Posibles

1. **Cache de Dependencias**
   ```yaml
   - name: Cache node modules
     uses: actions/cache@v3
     with:
       path: node_modules
       key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
   ```

2. **Pruebas en Múltiples Entornos**
   ```yaml
   strategy:
     matrix:
       node-version: [16, 18, 20]
   ```

3. **Análisis de Código Estático**
   - ESLint para calidad de código
   - Prettier para formato consistente

4. **Pruebas de Integración**
   - Tests end-to-end
   - Pruebas de rendimiento

## 🎉 Conclusión

Este pipeline CI/CD demuestra un flujo completo desde el código hasta el package, incluyendo:

- ✅ **Integración continua** con pruebas automáticas
- ✅ **Calidad de código** con verificaciones múltiples
- ✅ **Seguridad** con análisis estático
- ✅ **Empaquetado** automatizado y verificado
- ✅ **Artefactos** disponibles para descarga

El pipeline garantiza que cada cambio en el código pase por un proceso de calidad antes de estar disponible para distribución o despliegue.

---

**🔗 Repositorio de Ejemplo:** [tarea-7-devOps-MMurillo](https://github.com/tell1to/tarea-7-devOps-MMurillo.git)

*¡Listo para implementar en tus proyectos! 🚀*
