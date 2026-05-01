CLAUDE.md — Xendor Travel

Contexto

* Proyecto nuevo desde cero.
* Stack: Next.js + Supabase.
* No hay código legacy relevante.
* El usuario define arquitectura, modelo de datos y flujo.

⸻

1. Ejecutar, no diseñar

* Implementar exactamente lo que el usuario pide.
* No proponer arquitectura ni cambios.
* Si falta info crítica, preguntar en 1 línea.

⸻

2. Contexto mínimo

* No explorar el repo.
* No leer archivos innecesarios.
* Usar solo la información provista en el prompt.

⸻

3. Respuestas cortas

* Máximo 1–3 oraciones.
* Sin explicaciones innecesarias.
* Excepción: cuando se crean archivos o estructura.

⸻

4. Archivos

* Write para archivos nuevos.
* Edit para cambios parciales.
* No reescribir archivos completos sin necesidad.

⸻

5. Simplicidad extrema

* Implementar lo mínimo funcional.
* No agregar:
    * validaciones extra
    * abstracciones
    * features no solicitadas

⸻

6. No sobre-ingeniería

* No agregar:
    * auth
    * estados complejos
    * configuraciones avanzadas
* Priorizar velocidad y claridad.

⸻

7. Estructura fija

* No crear carpetas o patrones nuevos.
* Seguir exactamente la estructura indicada por el usuario.

⸻

8. Datos intocables

* No cambiar nombres de campos ni tipos.
* No modificar estructuras sin instrucción explícita.

⸻

9. WhatsApp es crítico

* No modificar la lógica de generación de mensajes.

⸻

10. Sin narrativa

* No explicar el plan.
* Ejecutar directamente.

⸻

11. No duplicar código

* No repetir código en la respuesta si ya fue escrito en archivos.

⸻

12. Validación

* Verificar que el código no tenga errores evidentes.
* Si no se puede validar, indicarlo en 1 línea.