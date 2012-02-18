package Box2D.utilities
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.geom.Matrix;
	import flash.geom.Point;
	
	import mx.core.UIComponent;

	public class EmorphicOutline
	{
		public var points:Vector.<Point>;
		
		public function EmorphicOutline(sp:*)
		{
			// Create a bitmap data object to draw our vector data
			var bmd:BitmapData = new BitmapData(sp.width, sp.height, true, 0);
			
			// Use a transform matrix to translate the drawn clip so that none of its
			// pixels reside in negative space. The draw method will only draw starting
			// at 0,0
			var mat:Matrix = new Matrix(1, 0, 0, 1, 0, 0);
			bmd.draw(sp, mat);
			
			// Pass the bitmap data to an actual bitmap
			var bmp:Bitmap = new Bitmap(bmd);
			
			// Add the bitmap to the stage
		//	var cmp:UIComponent = new UIComponent();
		//	cmp.addChild(bmp);
		//	stagingArea.addElement(cmp);
			
			// Grab all of the pixel data from the bitmap data object
			var pixels:Vector.<uint> = bmd.getVector(bmd.rect);
			
			// Setup a vector to hold our stroke points
			points = new Vector.<Point>;
			
			// Loop through all of the pixels of the bitmap data object and
			// create a point instance for each pixel location that isn't
			// transparent.
			var l:int = pixels.length;
			for(var i:int = 0; i < l; ++i)
			{
				// Check to see if the pixel is transparent
				if(pixels[i] != 0)
				{
					var pt:Point;
					
					// Check to see if the pixel is on the first or last
					// row. We'll grab everything from these rows to close the outline
					if(i <= bmp.width || i >= (bmp.width * bmp.height) - bmp.width)
					{
						pt = new Point();
						pt.x = int(i % bmp.width);
						pt.y = int(i / bmp.width);
						points.push(pt);
						continue;
					}
					
					// Check to see if the current pixel is on either extreme edge
					if(int(i % bmp.width) == 0 || int(i % bmp.width) == bmp.width - 1)
					{
						pt = new Point();
						pt.x = int(i % bmp.width);
						pt.y = int(i / bmp.width);
						points.push(pt);
						continue;
					}
					
					// Check to see if the previous or next pixel are transparent,
					// if so save the current one.
					if(i > 0 && i < bmp.width * bmp.height)
					{
						if(pixels[i - 1] == 0 || pixels[i + 1] == 0)
						{
							pt = new Point();
							pt.x = int(i % bmp.width);
							pt.y = int(i / bmp.width);
							points.push(pt);
						}
					}
				}
			}
		}
	}
}