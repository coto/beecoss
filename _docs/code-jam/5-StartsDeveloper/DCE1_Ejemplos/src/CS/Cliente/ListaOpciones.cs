using System;
using System.Collections.Generic;
using System.Text;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {
    
    /// <summary>
    /// Representa la lista de opciones de la aplicaci�n.
    /// </summary>
    internal class ListaOpciones {

        /// <summary>
        /// La lista de opciones disponibles.
        /// </summary>
        private static List<Opcion> opciones = new List<Opcion>();

        /// <summary>
        /// Construye est�ticamente la lista de opciones.
        /// </summary>
        static ListaOpciones() {
            opciones.Add(new OpcionListarProductos(1));
            opciones.Add(new OpcionIniciarVenta(2));
            opciones.Add(new OpcionAgregarItemVenta(3));
            opciones.Add(new OpcionListarCarrito(4));
            opciones.Add(new OpcionConfirmarVenta(5));
            opciones.Add(new OpcionCancelarVenta(6));
            opciones.Add(new OpcionSalir(99));
        }

        /// <summary>
        /// Obtiene el listado de opciones disponibles.
        /// </summary>
        /// <returns>El listado de opciones.</returns>
        internal static List<Opcion> ObtenerOpciones() {
            return opciones;
        }

        /// <summary>
        /// Permite obtener una opci�n seg�n su c�digo.
        /// </summary>
        /// <param name="codigo">El c�digo de la opci�n</param>
        /// <returns>La opci�n encontrada.</returns>
        /// <exception cref="OpcionInvalidaException">Si la opci�n no existe.</exception>
        internal static Opcion Obtener(int codigo) {
            Opcion opcion = null;
            foreach (Opcion o in opciones) {
                if (o.Codigo.Equals(codigo)) {
                    opcion = o;
                    break;
                }
            }

            if (opcion == null) {
                throw new OpcionInvalidaException("Opci�n inv�lida.");
            }

            return opcion;
        }
    }
}
