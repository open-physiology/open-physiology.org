import java.io.File;
import java.util.Scanner;

public class Compile
{
  public static void main(String [] args) throws Exception
  {
    Compile c = new Compile();
    c.run();
  }

  public void run()
  {
    File precompiled, publications, infrastructure;
    boolean fPubs, fInf;

    try
    {
      precompiled = new File("index_precompiled.html");
    }
    catch(Exception e)
    {
      System.out.println( "<html><head><title>Error</title></head><body>There was an error compiling index.html: index_precompiled.html could not be opened.</body></html>" );
      return;
    }

    try
    {
      publications = new File("publications.html");
      fPubs = true;
    }
    catch(Exception e)
    {
      fPubs = false;
      publications = null;
    }

    try
    {
      infrastructure = new File("infrastructure.html");
      fInf = true;
    }
    catch(Exception e)
    {
      fInf = false;
      infrastructure = null;
    }

    String the_html, the_pubs, the_inf;
    try
    {
      the_html = new Scanner(precompiled).useDelimiter("\\A").next();

      the_pubs = fPubs ? new Scanner(publications).useDelimiter("\\A").next() : "<p style='background-color: #FFC2C2'>Could not load publications.html</p>";

      the_inf = fInf ? new Scanner(infrastructure).useDelimiter("\\A").next() : "<p style='background-color: #FFC2C2'>Could not load infrastructure.html</p>";
    }
    catch(Exception e)
    {
      System.out.println( "<html><head><title>Error</title></head><body>There was an error compiling index.html: failed to scan the files</body></html>" );
      return;
    }

    /*
     * Ensure proper indenting in final product (for people who "view source")
     */
    the_inf = the_inf.replace("\n\r", "\n");
    the_inf = the_inf.replace("\r\n", "\n");
    the_inf = the_inf.replace("\r", "\n");
    the_inf = the_inf.replace("\n", "\n          ");

    the_pubs = the_pubs.replace("\n\r", "\n");
    the_pubs = the_pubs.replace("\r\n", "\n");
    the_pubs = the_pubs.replace("\r", "\n");
    the_pubs = the_pubs.replace("\n", "\n            ");


    the_html = the_html.replace("@PUBLICATIONS", the_pubs);
    the_html = the_html.replace("@INFRASTRUCTURE", the_inf);

    System.out.print( the_html );
  }
}
