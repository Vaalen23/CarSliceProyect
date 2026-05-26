CARSLICE QUIZ - VERSION BASE DE DATOS REAL

CAMBIOS IMPORTANTES:
- El modo local automático está desactivado.
- Login, registro, perfil, ranking y partidas usan Supabase.
- Si Supabase falla, NO entra con cualquier usuario.
- Si una partida no puede guardarse por un corte de conexión, queda en cola pendiente y se sincroniza al volver a iniciar sesión online.
- El botón de jugar local se ha quitado de la pantalla de login.

PARA QUE FUNCIONE:
1. Abre Supabase > SQL Editor.
2. Ejecuta el archivo supabase.sql completo.
3. Revisa config.js:
   - SUPABASE_URL debe tener tu URL.
   - SUPABASE_ANON_KEY debe tener tu anon public key.
   - ENABLE_SUPABASE debe estar en true.
4. Abre index.html con Live Server.
5. Crea usuario desde Registro.
6. Juega una partida y comprueba Ranking/partidas en Supabase.

NOTA:
La caché local se usa solo para ajustes, imágenes y partidas pendientes si hay un corte. La sesión real y los datos principales son Supabase.
