class ClassExample {
	private String name;
	public ClassExample(){
		
	}
	public static void main(String[] args){
		ClassExample ce = new ClassExample();
		ce.name = "John";
		
		ClassExampleInstance cei = new ClassExampleInstance();
		cei.name = "Peter";
	}
}

class ClassExampleInstance {
	private String name;
	
}
