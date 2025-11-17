const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function verifyPackage() {
    console.log('🔍 Iniciando verificación del package...');
    
    // Buscar archivo .tgz
    const files = fs.readdirSync('.');
    const packageFile = files.find(file => file.endsWith('.tgz'));
    
    if (!packageFile) {
        console.error('❌ No se encontró ningún archivo .tgz');
        process.exit(1);
    }
    
    console.log(`✅ Package encontrado: ${packageFile}`);
    
    // Verificar tamaño
    const stats = fs.statSync(packageFile);
    console.log(`📏 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    
    // Extraer y verificar contenido
    const tempDir = 'temp-verify';
    try {
        // Crear directorio temporal
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
        }
        fs.mkdirSync(tempDir);
        
        // Extraer package
        execSync(`tar -xzf ${packageFile} -C ${tempDir}`);
        
        const packageDir = path.join(tempDir, 'package');
        
        // Verificar archivos esenciales
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
        
        // Verificar package.json
        const packageJsonPath = path.join(packageDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        console.log('📋 Información del package.json:');
        console.log(`   Name: ${packageJson.name}`);
        console.log(`   Version: ${packageJson.version}`);
        console.log(`   Main: ${packageJson.main}`);
        
        // Verificar que se pueden ejecutar las pruebas en el package extraído
        console.log('🧪 Verificando pruebas en el package...');
        process.chdir(packageDir);
        execSync('npm test -- --silent', { stdio: 'inherit' });
        
        console.log('🎉 ¡Package verificado exitosamente!');
        
    } catch (error) {
        console.error('❌ Error durante la verificación:', error.message);
        process.exit(1);
    } finally {
        // Limpiar
        process.chdir('..');
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
        }
    }
}

verifyPackage();