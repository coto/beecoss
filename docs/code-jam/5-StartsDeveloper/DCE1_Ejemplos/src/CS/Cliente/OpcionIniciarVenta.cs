using System;
using System.Collections.Generic;
using System.Text;

using DCE05.Ejemplos.EstrellaUno.ReglasNegocio;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {
    
    /// <summary>
    /// Representa la opci�n de iniciar una venta.
    /// </summary>
    class OpcionIniciarVenta : Opcion {

        /// <summary>
        /// Construye una instancia de la opci�n con sus datos b�sicos.
        /// </summary>
        /// <param name="codigo">El c�digo de la opci�n.</param>
        internal OpcionIniciarVenta(int codigo) {
            Codigo = codigo;
            Descripcion = "Iniciar Venta";
        }

        /// <summary>
        /// Ejecuta la acci�n asociada a la opci�n.
        /// </summary>
        /// <exception cref="OpcionInvalidaException">Si la opci�n no fue ejecutada exitosamente.</exception>
        internal override void EjecutarAccion() {
            if (PuntoDeVenta.VentaActual != null) {
                throw new OpcionInvalidaException("La venta ya fue iniciada.");
            }

            try {
                CatalogoVentas catalogo = new CatalogoVentas();
                PuntoDeVenta.VentaActual = catalogo.IniciarVenta();
                Console.WriteLine("Venta iniciada.");
            } catch (ReglasNegocioException ex) {
                Console.WriteLine("Error al iniciar una venta: " + ex.Message);
            }
        }
    }
}