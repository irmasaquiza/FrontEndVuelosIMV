# Administrador

Cada modulo vive en su propia carpeta y debe crecer con esta forma:

- `*GestionView.vue`: vista principal; conecta composables y componentes.
- `components/`: interfaz del modulo, como formularios, tablas y modales.
- `composables/`: logica reutilizable, estado, llamadas a API y calculos.

El modulo `clientes` ya esta separado como referencia inicial para replicar el patron en los demas modulos.
