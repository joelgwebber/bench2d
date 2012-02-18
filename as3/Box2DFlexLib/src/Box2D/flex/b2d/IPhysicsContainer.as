package Box2D.flex.b2d
{
	import Box2D.utilities.WorldDefinition;

	public interface IPhysicsContainer
	{
		function step():void;
		function get worldDef():WorldDefinition;
	}
}