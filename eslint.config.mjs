import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

/**
 * Configuracion de ESLint para vsd-backend.
 *
 * Ademas de las reglas habituales, aqui se impone la regla de dependencia de
 * la arquitectura hexagonal. Sin esta comprobacion, la arquitectura se
 * erosiona sin que nadie lo note: alguien importa Prisma en el dominio "solo
 * esta vez" y meses despues el nucleo ya no se puede probar sin base de datos.
 */

const MENSAJE_DOMINIO_A_CAPAS =
  'domain/ no puede depender de application/ ni de infrastructure/. Las dependencias apuntan hacia adentro. Si el dominio necesita algo de fuera, lo que falta es un puerto de salida en domain/ports/out/.';

const MENSAJE_DOMINIO_EXTERNO =
  'domain/ no puede importar bibliotecas externas ni modulos de Node. El nucleo debe poder ejecutarse y probarse sin framework. Si necesitas algo del exterior, declara un puerto en domain/ports/out/ y ponle un adaptador en infrastructure/.';

const MENSAJE_APLICACION_A_INFRA =
  'application/ no puede depender de infrastructure/. Depende del puerto que declara domain/, y es infrastructure/config quien decide que implementacion se inyecta.';

export default tseslint.config(
  {
    // Los archivos de configuracion en .mjs quedan fuera del analisis con
    // tipos: no forman parte del codigo del proyecto y no estan en tsconfig.
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '*.config.mjs'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ---------- Frontera: el dominio no depende de nadie ----------
  {
    files: ['src/domain/**/*.ts'],
    // Las pruebas se excluyen de la prohibicion de dependencias externas:
    // necesitan importar el ejecutor de pruebas y no forman parte del
    // artefacto que se despliega. Las fronteras entre capas si les aplican,
    // y se imponen en el bloque siguiente.
    ignores: ['src/domain/**/*.spec.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/application/**', '**/infrastructure/**'],
              message: MENSAJE_DOMINIO_A_CAPAS,
            },
            {
              // Todo lo que no empiece por "." es un paquete externo o un
              // modulo de Node. El dominio no puede usar ninguno.
              regex: '^[^.]',
              message: MENSAJE_DOMINIO_EXTERNO,
            },
          ],
        },
      ],
    },
  },

  // ---------- Frontera: las pruebas del dominio tampoco cruzan capas ----------
  {
    files: ['src/domain/**/*.spec.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/application/**', '**/infrastructure/**'],
              message: MENSAJE_DOMINIO_A_CAPAS,
            },
          ],
        },
      ],
    },
  },

  // ---------- Frontera: la aplicacion no conoce la infraestructura ----------
  {
    files: ['src/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**'],
              message: MENSAJE_APLICACION_A_INFRA,
            },
          ],
        },
      ],
    },
  },

  // ---------- Convencion del guion bajo ----------
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          // Un nombre que empieza por guion bajo se descarta a proposito.
          // Hace falta para extraer una clave de un objeto y quedarse con el
          // resto: `const { clave: _descartada, ...resto } = objeto`.
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },

  // ---------- Pruebas ----------
  {
    files: ['src/**/*.spec.ts'],
    rules: {
      // En las pruebas se construyen dobles y datos a proposito imperfectos.
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  prettier,
);
