using System;
using System.IO;

class Program
{
    static void Main()
    {
        string p = @"C:\Users\Sam\Documents\Test.txt";

        string e = Path.GetExtension(p);
        if (e == ".txt")
        {
            Console.WriteLine(e);
        }
    }
}