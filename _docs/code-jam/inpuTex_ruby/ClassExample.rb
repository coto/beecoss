class Person
  attr_accessor :fname, :lname
 
  def initialize(fname, lname)
    @fname = fname
    @lname = lname
  end
 
  def to_s
    @lname + ", " + @fname
  end
 
  def self.find_by_fname(fname)
    found = nil
    ObjectSpace.each_object(Person) { |o|
      found = o if o.fname == fname
    }
    found
  end
end