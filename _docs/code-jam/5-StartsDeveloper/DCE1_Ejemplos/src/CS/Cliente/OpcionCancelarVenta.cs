using System;
using System.Collections.Generic;
using System.Text;

using DCE05.Ejemplos.EstrellaUno.ReglasNegocio;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {
    
    /// <summary>
    /// Representa la opcion de cancelar la venta actual.
    /// </summary>
    class OpcionCancelarVenta : Opcion {

        /// <summary>
        /// Ejecuta la acci�n asociada a la opci�n.
        /// </summary>
        internal override void EjecutarAccion() {

            if (PuntoDeVenta.VentaActual == null) {
                throw new OpcionInvalidaException("La venta no fue iniciada.");
            }
            
            try {
                CatalogoVentas catalogo = new CatalogoVentas();
                catalogo.CancelarVenta(PuntoDeVenta.VentaActual);
                PuntoDeVenta.VentaActual = null;
                Console.WriteLine("Venta cancelada.\n");
            } catch (ReglasNegocioException ex) {
                Console.WriteLine("Error al cancelar la venta actual: " + ex.Message);
            }
        }

        /// <summary>
        /// Construye una instancia de la opci�n con sus datos b�sicos.
        /// </summary>
        /// <param name="codigo">El c�digo de la opci�n.</param>
        internal OpcionCancelarVenta(int codigo) {
            Codigo = codigo;
            Descripcion = "Cancelar Venta Actual";
        }

    }
}
