using System;
using System.Collections.Generic;
using System.Text;

namespace DCE05.Ejemplos.EstrellaUno.ReglasNegocio {

    /// <summary>
    /// Representa un �tem en una venta.
    /// </summary>
    public class ItemVenta {

        private int codigo;
        private Producto producto;
        private int cantidad;

        /// <summary>
        /// Cosntruye una instancia del �tem con los datos b�sicos.
        /// </summary>
        /// <param name="producto">El producto asociado.</param>
        /// <param name="cantidad">La cantidad de unidades del producto.</param>
        public ItemVenta(Producto producto, int cantidad) : this(0, producto, cantidad) {
        }

        /// <summary>
        /// Construye una inastancia del �tem completo.
        /// </summary>
        /// <param name="codigo">El c�digo del �tem</param>
        /// <param name="producto">El producto asociado.</param>
        /// <param name="cantidad">La cantidad de unidades del producto.</param>
        public ItemVenta(int codigo, Producto producto, int cantidad) {
            this.codigo = codigo;
            Producto = producto;
            Cantidad = cantidad;
        }

        /// <summary>
        /// El c�digo del �tem.
        /// </summary>
        /// <exception cref="ArgumentException">Si el par�metro es inv�lido.</exception>
        public int Codigo {
            get{
                return this.codigo;
            }
            internal set {
                if (value <= 0) {
                    throw new ArgumentException("El c�digo es inv�lido.");
                }
                this.codigo = value;
            }
        }

        /// <summary>
        /// El producto del �tem.
        /// </summary>
        /// <exception cref="ArgumentException">Si el par�metro es inv�lido.</exception>
        public Producto Producto {
            private set {
                if (value == null) {
                    throw new ArgumentException("El producto no puede ser nulo.");
                }
                this.producto = value;
            }
            get {
                return this.producto;
            }
        }

        /// <summary>
        /// La cantidad de productos en el �tem.
        /// </summary>
        /// <exception cref="ArgumentException">Si el par�metro es inv�lido.</exception>
        public int Cantidad {
            private set {
                if (value <= 0) {
                    throw new ArgumentException("La cantidad es inv�lida.");
                }
                this.cantidad = value; 
            }
            get {
                return this.cantidad;
            }
        }

        /// <summary>
        /// Calcula el total del �tem de venta.
        /// </summary>
        /// <returns>El total del �tem.</returns>
        public double CalcularTotal(){
            return producto.Precio * cantidad;
        }
    }
}
