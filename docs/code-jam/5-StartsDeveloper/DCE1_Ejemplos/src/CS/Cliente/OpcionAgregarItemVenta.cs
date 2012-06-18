using System;
using System.Collections.Generic;
using System.Text;
using DCE05.Ejemplos.EstrellaUno.ReglasNegocio;

namespace DCE05.Ejemplos.EstrellaUno.Cliente {
    
    /// <summary>
    /// Representa la opci�n de agregar un �tem de venta a una venta iniciada.
    /// </summary>
    internal class OpcionAgregarItemVenta : Opcion {

        /// <summary>
        /// Construye una instancia de la opci�n con sus datos b�sicos.
        /// </summary>
        /// <param name="codigo">El c�digo de la opci�n.</param>
        internal OpcionAgregarItemVenta(int codigo) {
            Codigo = codigo;
            Descripcion = "Agregar un Item de Venta";
        }

        /// <summary>
        /// Ejecuta la acci�n asociada a la opci�n.
        /// </summary>
        /// <exception cref="OpcionInvalidaException">Si la opci�n no fue ejecutada exitosamente.</exception>
        internal override void EjecutarAccion() {
            if (PuntoDeVenta.VentaActual == null) {
                throw new OpcionInvalidaException("La venta no fue iniciada.");
            }

            try {
                new OpcionListarProductos().EjecutarAccion();

                CatalogoProductos catalogoProd = new CatalogoProductos();
                Producto producto = null;
                Console.Write("Seleccione un Producto de la lista a agregar: ");
                try {
                    int idProducto = int.Parse(Console.ReadLine());
                    producto = catalogoProd.ObtenerProducto(idProducto);
                    if (producto == null) {
                        throw new OpcionInvalidaException("Producto inv�lido.");
                    }
                } catch (FormatException) {
                    throw new OpcionInvalidaException("N�mero inv�lido !");
                }

                int cantidad = 0;
                Console.Write("Seleccione la cantidad a agregar: ");
                try {
                    cantidad = int.Parse(Console.ReadLine());
                } catch (FormatException) {
                    throw new OpcionInvalidaException("Cantidad inv�lida !");
                }

                PuntoDeVenta.VentaActual.AgregarItem(new ItemVenta(producto, cantidad));

                Console.Clear();
                Console.WriteLine("Agregados {0} unidades del producto {1}.\n", cantidad, producto.Descripcion);

            } catch (ReglasNegocioException ex) {
                Console.Clear();
                Console.WriteLine("Error al agregar un �tem a la venta actual: " + ex.Message);
            } catch (OpcionInvalidaException ex) {
                Console.Clear();
                Console.WriteLine(ex.Message);
            } catch (Exception) {
                Console.Clear();
                Console.WriteLine("Error al agregar un �tem a la venta actual.");
            }
        }
    }
}
