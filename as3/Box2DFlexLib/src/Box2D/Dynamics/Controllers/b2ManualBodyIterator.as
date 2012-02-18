package Box2D.Dynamics.Controllers 
{
	import Box2D.Dynamics.b2Body;

	/** @private */
	internal class b2ManualBodyIterator implements IBodyIterator
	{
		public var position:int = 0;
		public var bodyList:Vector.<b2Body>;
		
		public function HasNext():Boolean
		{
			return position < bodyList.length;
		}
			
		public function Next():b2Body
		{
			return bodyList[position++];
		}
	}
	
}