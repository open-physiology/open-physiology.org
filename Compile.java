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
    File precompiled, publications, infrastructure, teams, demos, funding;
    boolean fPubs, fInf, fTeams, fDemos, fFunding;

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
      funding = new File("funding.html");
      fFunding = true;
    }
    catch(Exception e)
    {
      fFunding = false;
      funding = null;
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

    try
    {
      teams = new File("teams.html");
      fTeams = true;
    }
    catch(Exception e)
    {
      fTeams = false;
      teams = null;
    }

    try
    {
      demos = new File("demos.html");
      fDemos = true;
    }
    catch(Exception e)
    {
      fDemos = false;
      demos = null;
    }

    String the_html, the_pubs, the_inf, the_teams, the_demos, the_funding;
    try
    {
      the_html = new Scanner(precompiled).useDelimiter("\\A").next();

      the_pubs = fPubs ? new Scanner(publications).useDelimiter("\\A").next() : "<p style='background-color: #FFC2C2'>Could not load publications.html</p>";

      the_inf = fInf ? new Scanner(infrastructure).useDelimiter("\\A").next() : "<p style='background-color: #FFC2C2'>Could not load infrastructure.html</p>";

      the_teams = fTeams ? new Scanner(teams).useDelimiter("\\A").next() : "<p style='background-color: #FFC2C2'>Could not load people.html</p>";

      the_demos = fDemos ? new Scanner(demos).useDelimiter("\\A").next() : "<p style='background-color: #FFC2C2'>Count not load demos.html</p>";

      the_funding = fFunding ? new Scanner(funding).useDelimiter("\\A").next() : "<p style='background-color: #FFC2C2'>Count not load funding.html</p>";
    }
    catch(Exception e)
    {
      System.out.println( "<html><head><title>Error</title></head><body>There was an error compiling index.html: failed to scan the files</body></html>" );
      return;
    }

    /*
     * Ensure proper indenting in final product (for people who "view source")
     */
    the_inf = replace_linebreaks( the_inf );
    the_pubs = replace_linebreaks( the_pubs );
    the_teams = replace_linebreaks( the_teams );
    the_demos = replace_linebreaks( the_demos );
    the_funding = replace_linebreaks( the_funding );
    the_html = replace_linebreaks( the_html );

    the_html = the_html.replace("@PUBLICATIONS", the_pubs);
    the_html = the_html.replace("@INFRASTRUCTURE", the_inf);
    the_html = the_html.replace("@TEAMS", the_teams);
    the_html = the_html.replace("@DEMOS", the_demos);
    the_html = the_html.replace("@FUNDING", the_funding);

    System.out.print( the_html );
  }

  String replace_linebreaks( String x )
  {
    return x.replace("\n\r", "\n").replace("\r\n", "\n").replace("\r", "\n").replace("\n", "\n            ");
  }
}
