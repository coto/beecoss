using System;
using System.Collections.Generic;
using System.Text;

using DCE05.Ejemplos.EstrellaUno.ReglasNegocio;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {

    /// <summary>
    /// Representa la opci�n de listar el carrito de compras.
    /// </summary>
    internal class OpcionListarCarrito : Opcion {

        /// <summary>
        /// Construye una instancia de la opci�n con sus datos b�sicos.
        /// </summary>
        /// <param name="codigo">El c�digo de la opci�n.</param>
        internal OpcionListarCarrito(int codigo) {
            Codigo = codigo;
            Descripcion = "Listar Carrito de Compras";
        }

        /// <summary>
        /// Ejecuta la acci�n asociada a la opci�n.
        /// </summary>
        /// <exception cref="OpcionInvalidaException">Si la opci�n no fue ejecutada exitosamente.</exception>
        internal override void EjecutarAccion() {
            
            if (PuntoDeVenta.VentaActual == null) {
                throw new OpcionInvalidaException("La venta no fue iniciada.");
            }

            if (PuntoDeVenta.VentaActual.Items.Count.Equals(0)) {
                Console.WriteLine("Carrito vac�o.");
            } else {
                Console.WriteLine("Carrito de Compras");
                Console.WriteLine("------------------\n");

                Console.WriteLine("Items: " + PuntoDeVenta.VentaActual.Items.Count.ToString());
                Console.WriteLine("{0}\t{1}\t{2}\t{3}",
                    "Codigo".PadRight(7),
                    "Producto".PadRight(30),
                    "Cantidad".PadRight(9),
                    "Sub Total");

                foreach (ItemVenta item in PuntoDeVenta.VentaActual.Items) {
                    Console.WriteLine("{0}\t{1}\t{2}\t{3}",
                        item.Codigo.ToString().PadRight(7),
                        item.Producto.Descripcion.PadRight(30),
                        item.Cantidad.ToString().PadRight(9),
                        item.CalcularTotal());
                }
            }
        }

    }
}
