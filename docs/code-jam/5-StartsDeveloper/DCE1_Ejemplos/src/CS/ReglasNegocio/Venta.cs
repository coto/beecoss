using System;
using System.Collections.Generic;
using System.Text;

namespace DCE05.Ejemplos.EstrellaUno.ReglasNegocio {

    /// <summary>
    /// Representa la comercializaci�n de un conjunto de productos (�tems de venta).
    /// </summary>
    public class Venta {

        private int codigo;
        private DateTime fecha;
        private List<ItemVenta> items;

        /// <summary>
        /// Construye una instancia vac�a de la venta.
        /// </summary>
        internal Venta() {
            this.codigo = 0;
            this.fecha = DateTime.MaxValue;
            this.items = new List<ItemVenta>();
        }

        /// <summary>
        /// La lista de items de la venta.
        /// </summary>
        public List<ItemVenta> Items {
            get { return items; }
        }

        /// <summary>
        /// El c�digo de la venta.
        /// </summary>
        /// <exception cref="ArgumentException">Si el par�metro es inv�lido.</exception>
        public int Codigo {
            get { return codigo; }
            internal set {
                if (value <= 0) {
                    throw new ArgumentException("El c�digo es inv�lido.");
                }
                codigo = value;
            }
        }

        /// <summary>
        /// La fecha de la venta.
        /// </summary>
        public DateTime Fecha {
            get { return fecha; }
            internal set { fecha = value; }
        }

        /// <summary>
        /// Calcula el total de la venta.
        /// </summary>
        /// <returns>El total de la venta.</returns>
        public double Total() {
            double total = 0f;
            foreach (ItemVenta item in items) {
                total += item.CalcularTotal();
            }
            return total;
        }

        /// <summary>
        /// Agrega un �tem a la venta.
        /// </summary>
        /// <param name="item">El �tem a agregar.</param>
        /// <exception cref="ArgumentException">Si el par�metro es inv�lido.</exception>
        public void AgregarItem(ItemVenta item) {
            if (item == null || item.Producto == null || item.Cantidad.Equals(0)) {
                throw new ArgumentException("El �tem es inv�lido.");
            }
            Items.Add(item);
        }
    }
}
