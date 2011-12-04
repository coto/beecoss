interface Animal
{
    String getName();
    String talk();
}
 
abstract class AnimalBase implements Animal
{
    private final String name;
 
    protected AnimalBase(String name)
    {
        this.name = name;
    }
 
    public String getName()
    {
        return name;
    }
}
 
class Cat extends AnimalBase
{
    public Cat(String name)
    {
        super(name);
    }
 
    public String talk()
    {
        return "Meowww!";
    }
}
 
class Dog extends AnimalBase
{
    public Dog(String name)
    {
        super(name);
    }
 
    public String talk()
    {
        return "Arf! Arf!";
    }
}
 
public class Polymorphism
{
    // prints the following:
    //
    // Missy: Meowww!
    // Mr. Mistoffelees: Meowww!
    // Lassie: Arf! Arf!
    //
    public static void main(String[] args)
    {
        Animal[] animals = 
        {
            new Cat("Missy"),
            new Cat("Mr. Mistoffelees"),
            new Dog("Lassie")
        };
 
        for (Animal a : animals)
        {
            System.out.println(a.getName() + ": " + a.talk());
        }
    }
}
