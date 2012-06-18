using System;
using System.Collections.Generic;
using System.Text;

using DCE05.Ejemplos.EstrellaUno.ReglasNegocio;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {

    /// <summary>
    /// Representa la opci�n de salir del sistema y finalizar la venta.
    /// </summary>
    internal class OpcionSalir : Opcion {

        /// <summary>
        /// Ejecuta la acci�n asociada a la opci�n.
        /// </summary>
        internal override void EjecutarAccion() {
            try {
                CatalogoVentas catalogo = new CatalogoVentas();
                if (PuntoDeVenta.VentaActual != null) {
                    catalogo.CancelarVenta(PuntoDeVenta.VentaActual);
                }
                catalogo.CancelarVentasPendientes();
                PuntoDeVenta.Salir();
            } catch (ReglasNegocioException ex) {
                Console.WriteLine("Error al cancelar las ventas : " + ex.Message);
            }
        }

        /// <summary>
        /// Construye una instancia de la opci�n con sus datos b�sicos.
        /// </summary>
        /// <param name="codigo">El c�digo de la opci�n.</param>
        internal OpcionSalir(int codigo) {
            Codigo = codigo;
            Descripcion = "Salir";
        }

    }
}
