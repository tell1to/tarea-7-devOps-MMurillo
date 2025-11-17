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