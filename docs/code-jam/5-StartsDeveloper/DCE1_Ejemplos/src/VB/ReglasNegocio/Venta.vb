''' <summary>
''' Representa la comercialización de un conjunto de productos (ítems de venta).
''' </summary>
Public Class Venta

    Private _Codigo As Integer
    Private _Fecha As DateTime
    Private _Items As List(Of ItemVenta)

    ''' <summary>
    ''' Construye una instancia vacía de la venta.
    ''' </summary>
    Friend Sub New()
        Me._Codigo = 0
        Me.Fecha = DateTime.MaxValue
        Me._Items = New List(Of ItemVenta)()
    End Sub

    ''' <summary>
    ''' La lista de items de la venta.
    ''' </summary>
    Public ReadOnly Property Items() As List(Of ItemVenta)
        Get
            Return Me._Items
        End Get
    End Property

    ''' <summary>
    ''' El código de la venta.
    ''' </summary>
    ''' <value>El nuevo código de la venta</value>
    ''' <returns>El código de la venta.</returns>
    ''' <exception cref="ArgumentException">Si el parámetro es inválido.</exception>
    Public Property Codigo() As Integer
        Get
            Return Me._Codigo
        End Get
        Friend Set(ByVal Value As Integer)
            If Value <= 0 Then
                Throw New ArgumentException("El código es inválido.")
            End If
            Me._Codigo = Value
        End Set
    End Property

    ''' <summary>
    ''' La fecha de la venta.
    ''' </summary>
    ''' <value>La nueva fecha de la venta.</value>
    ''' <returns>la fecha de la venta.</returns>
    Public Property Fecha() As DateTime
        Get
            Return Fecha
        End Get
        Friend Set(ByVal Value As DateTime)
            _Fecha = Value
        End Set
    End Property

    ''' <summary>
    ''' Calcula el total de la venta.
    ''' </summary>
    ''' <returns>El total de la venta.</returns>
    Public Function Total() As Double
        Dim SubTotal As Double = 0.0F
        Dim Item As ItemVenta
        For Each Item In Items
            SubTotal = SubTotal + Item.CalcularTotal()
        Next
        Return SubTotal
    End Function

    ''' <summary>
    ''' Agrega un ítem a la venta.
    ''' </summary>
    ''' <param name="item">El ítem a agregar.</param>
    ''' <exception cref="ArgumentException">Si el parámetro es inválido.</exception>
    Public Sub AgregarItem(ByVal item As ItemVenta)
        If (item Is Nothing Or item.Producto Is Nothing Or item.Cantidad.Equals(0)) Then
            Throw New ArgumentException("El ítem es inválido.")
        End If
        Items.Add(item)
    End Sub
End Class
