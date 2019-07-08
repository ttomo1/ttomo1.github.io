<?php
// Your code here!
$db = new SQLite3('test.db');
$db->exec("CREATE TABLE test (test_name text, test_datetime timestamp NOT NULL default (datetime(CURRENT_TIMESTAMP,'localtime')))");
$db->query("INSERT INTO test (test_name) VALUES ('foo')");
$db->query("INSERT INTO test (test_name) VALUES ('baz')");
$db->query("INSERT INTO test (test_name) VALUES ('bar')");
$result = $db->query('SELECT * FROM test');
while ($row = $result->fetchArray()) {
    echo $row[0] . "\n";
    echo $row[1] . "\n";
}
?>
