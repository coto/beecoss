using System;
using System.Collections.Generic;
using System.Text;

using DCE05.Ejemplos.EstrellaUno.ReglasNegocio;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {
    
    /// <summary>
    /// Representa la opci�n de finalizar una venta.
    /// </summary>
    internal class OpcionConfirmarVenta : Opcion {

        /// <summary>
        /// Ejecuta la acci�n asociada a la opci�n.
        /// </summary>
        /// <exception cref="OpcionInvalidaException">Si la opci�n no fue ejecutada exitosamente.</exception>
        internal override void EjecutarAccion() {
            if (PuntoDeVenta.VentaActual == null) {
                throw new OpcionInvalidaException("La venta no fue iniciada.");
            }

            try {
                CatalogoVentas catalogo = new CatalogoVentas();
                catalogo.ConfirmarVenta(PuntoDeVenta.VentaActual);
                Console.WriteLine("Venta confirmada.\nTotal: {0}\n", PuntoDeVenta.VentaActual.Total());
                PuntoDeVenta.VentaActual = null;
            } catch (ReglasNegocioException ex) {
                Console.WriteLine("Error al finalizar la venta: " + ex.Message);
            }
        }

        /// <summary>
        /// Construye una instancia de la opci�n con sus datos b�sicos.
        /// </summary>
        /// <param name="codigo">El c�digo de la opci�n.</param>
        internal OpcionConfirmarVenta(int codigo) {
            Codigo = codigo;
            Descripcion = "Confirmar Venta Actual";
        }

    }
}
