function extractDomain(url){
  // Really cool way to extract domains from URLs
  // taken from http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string#answer-8498668
  let a = document.createElement('a');
  a.href = url;
  // Strip subdomain (or www.) and return
  return a.hostname.split('.').slice(-2).join('.');
}

export default extractDomain;
