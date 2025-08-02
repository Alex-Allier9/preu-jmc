# 📊 PLANTILLA GOOGLE SHEETS - TESTIMONIOS JMC

## 📋 **Copiar y Pegar Directamente**

### **Fila 1 - Headers (OBLIGATORIOS):**
```
nombre	carrera	universidad	año	testimonio	puntajeM1	puntajeM2	puntajeLenguaje	foto
```

### **Fila 2 - Beltrán Llaneza (Máximo Nacional):**
```
Beltrán Llaneza	Ingeniería Comercial	Universidad Adolfo Ibáñez	2023	Para mí este preuniversitario no fue solamente ir a la clase, ejercitar y evolucionar, también tuve el momento para compartir con amigos y compañeros, para aprender personalmente diferentes cosas sobre la vida. Me ayudó a subir mis puntajes para poder dar ensayos que me sirvieron para medir mis tiempos y controlar mis pensamientos. Además de todo lo aprendido me voy contento por mis resultados y por el tiempo compartido, y por llevarme conocimientos y aprendizajes de todos los que me acompañaron durante todo el año.	1000		780	
```

### **Fila 3 - Belén Becerra:**
```
Belén Becerra	Enfermería	Universidad de los Andes	2023	Estuve en preu con Cartes durante el año 2023 y sin duda me dio la mejor preparación para mi prueba de matemáticas. Es un profesor muy motivador, que te ayuda a mantener el foco y subir los ánimos si es necesario. Siempre me dio las mejores explicaciones para entender al máximo la materia y su material fue muy completo, ofreciendo guías extra de querer realizar más ejercicios. Creo que además se enfoca mucho en cada uno de sus alumnos, logrando que sus clases sean muy personalizadas y centradas en que todos vayan entendiendo y aprendiendo. Estoy muy agradecida de haber tomado clases con él y de haber obtenido mi mejor prueba gracias a su preparación.	820		760	
```

### **Fila 4 - Lucas Cano:**
```
Lucas Cano	Ingeniería Comercial	Universidad de Chile	2023	El preuniversitario JMC entrega una formación personalizada, su sistema basado en grupos pequeños permite que el profesor se centre más en las necesidades y dudas de cada estudiante. José Manuel es un docente con experiencia preparando a estudiantes para la prueba y eso se nota en la calidad de sus clases, además, se atreve a dar un paso más allá, entregando material extra si los estudiantes lo piden, algo que les permite a aquellos que quieran desafiarse tener la oportunidad de hacerlo. Valoro mucho la experiencia que tuve en JMC y lo dejo más que recomendado a estudiantes que quieran prepararse para dar la PAES.	870	840	800	
```

### **Fila 5 - Ejemplo Máximo Nacional 2023:**
```
[Completar con datos reales]	[Carrera]	[Universidad]	2023	[Testimonio completo del estudiante que logró máximo nacional en 2023]	1000		[Puntaje lenguaje]	[URL foto o vacío]
```

### **Fila 6 - Ejemplo Máximo Nacional 2022:**
```
[Completar con datos reales]	[Carrera]	[Universidad]	2022	[Testimonio del primer máximo nacional de 2022]	1000		[Puntaje lenguaje]	[URL foto o vacío]
```

---

## 🎯 **Instrucciones de Uso Rápido**

1. **Crear nuevo Google Sheet**
2. **Copiar y pegar** cada fila en el orden mostrado
3. **Rellenar datos faltantes** de los máximos nacionales
4. **Hacer público** el sheet (enlace compartido)
5. **Copiar ID** del enlace y configurar en el código

## 📝 **Campos Explicados**

| Campo | Descripción | Ejemplo | ¿Obligatorio? |
|-------|-------------|---------|---------------|
| **nombre** | Nombre completo del estudiante | "Beltrán Llaneza" | ✅ SÍ |
| **carrera** | Carrera universitaria de destino | "Ingeniería Comercial" | ✅ SÍ |
| **universidad** | Universidad de destino | "Universidad de Chile" | ✅ SÍ |
| **año** | Año del testimonio | 2023 | ✅ SÍ |
| **testimonio** | Texto completo del testimonio | "Para mí este preuniversitario..." | ✅ SÍ |
| **puntajeM1** | Puntaje Matemática 1 (100-1000) | 850 | ⚠️ Obligatorio |
| **puntajeM2** | Puntaje Matemática 2 (opcional) | 840 o dejar vacío | ❌ Opcional |
| **puntajeLenguaje** | Puntaje Lenguaje (opcional) | 780 o dejar vacío | ❌ Opcional |
| **foto** | URL de foto del estudiante | URL completa o dejar vacío | ❌ Opcional |

## 🏆 **Detección Automática de Máximos Nacionales**

**¡IMPORTANTE!** Ya no necesitas las columnas `maximoNacional` ni `destacado`. El sistema ahora detecta automáticamente:

- **Máximo Nacional:** Si M1 = 1000 y/o M2 = 1000
- **Badge dorado:** Se muestra automáticamente con trofeo 🏆
- **Diseño especial:** Fondo negro/dorado para máximos nacionales

### **Ejemplos de Detección:**
- `M1: 1000, M2: vacío` → **✅ Máximo Nacional**
- `M1: 950, M2: 1000` → **✅ Máximo Nacional** 
- `M1: 1000, M2: 1000` → **✅ Máximo Nacional**
- `M1: 980, M2: 950` → ❌ Regular

## ✅ **Resultado en la Web**

Con estos datos actualizados, la página mostrará:

- **🏆 Diseño dorado automático** para máximos nacionales (puntaje = 1000)
- **📊 Filtros dinámicos** (Todos, Máximos Nacionales, Universidad, Carrera)
- **🔄 Ordenamiento inteligente** (Recientes, Mayor puntaje, Alfabético, Universidad)
- **📱 Layout responsivo horizontal** con fotos grandes en tablet/desktop
- **👤 Avatares automáticos** con iniciales cuando no hay foto
- **🎨 Gradientes aleatorios** para avatares (8 combinaciones)
- **📏 Altura dinámica** que se ajusta al contenido del testimonio
- **🏷️ Badges posicionados** sin superposición con el contenido
- **Animaciones suaves** de entrada

## 🔄 **Mantenimiento Simplificado**

### **Para agregar nuevos testimonios:**
1. **Agregar nueva fila** al final del Google Sheet
2. **Completar campos obligatorios:** nombre, carrera, universidad, año, testimonio
3. **Agregar puntajes:** M1 (obligatorio), M2 y Lenguaje (opcionales)
4. **Foto opcional:** URL completa o dejar vacío (se generarán iniciales automáticamente)
5. **Guardar** (automático en Google Sheets)
6. **¡Listo!** La página se actualiza automáticamente

### **Máximos Nacionales:**
- ✅ **Automático:** Solo pon puntaje 1000 en M1 y/o M2
- ✅ **Sin configuración:** No necesitas marcar nada manualmente
- ✅ **Diseño especial:** Se aplica automáticamente (dorado + trofeo)

### **Fotos de estudiantes:**
- 📸 **Con foto:** Pega URL completa de la imagen
- 👤 **Sin foto:** Deja vacío, se generarán iniciales con gradiente aleatorio
- 🎨 **Consistencia:** Mismo estudiante = mismo gradiente siempre

¡Perfecto para que José Manuel pueda mantener actualizada la información sin tocar código!